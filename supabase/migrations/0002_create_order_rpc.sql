-- func rpc สำหรับสร้าง order
create or replace function public.create_order(
  p_user_id uuid,
  p_items jsonb
)
returns jsonb
language plpgsql
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product record;
  v_quantity integer;

  v_unit_discount numeric(10,2);
  v_unit_price_after_discount numeric(10,2);
  v_vat_amount numeric(10,2);
  v_line_subtotal numeric(10,2);
  v_line_discount numeric(10,2);
  v_line_vat numeric(10,2);
  v_line_total numeric(10,2);

  v_subtotal numeric(10,2) := 0;
  v_total_discount numeric(10,2) := 0;
  v_total_vat numeric(10,2) := 0;
  v_grand_total numeric(10,2) := 0;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order items are required';
  end if;

  insert into public.orders (
    user_id,
    subtotal,
    total_vat,
    total_discount,
    grand_total
  )
  values (
    p_user_id,
    0,
    0,
    0,
    0
  )
  returning id into v_order_id;

  for v_item in
    select value
    from jsonb_array_elements(p_items) as item(value)
  loop
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity <= 0 then
      raise exception 'Quantity must be greater than 0';
    end if;

    select
      id,
      price,
      discount_price,
      vat_rate,
      stock
    into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if not found then
      raise exception 'Product not found';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Insufficient stock';
    end if;

    v_unit_discount := coalesce(v_product.discount_price, 0);
    v_unit_price_after_discount := v_product.price - v_unit_discount;
    v_vat_amount := v_unit_price_after_discount * v_product.vat_rate / 100;

    v_line_subtotal := v_unit_price_after_discount * v_quantity;
    v_line_discount := v_unit_discount * v_quantity;
    v_line_vat := v_vat_amount * v_quantity;
    v_line_total := (v_unit_price_after_discount + v_vat_amount) * v_quantity;

    insert into public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_sale,
      vat_at_sale
    )
    values (
      v_order_id,
      v_product.id,
      v_quantity,
      v_product.price,
      v_vat_amount
    );

    update public.products
    set stock = stock - v_quantity
    where id = v_product.id;

    v_subtotal := v_subtotal + v_line_subtotal;
    v_total_discount := v_total_discount + v_line_discount;
    v_total_vat := v_total_vat + v_line_vat;
    v_grand_total := v_grand_total + v_line_total;
  end loop;

  update public.orders
  set
    subtotal = v_subtotal,
    total_discount = v_total_discount,
    total_vat = v_total_vat,
    grand_total = v_grand_total
  where id = v_order_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'subtotal', v_subtotal,
    'total_discount', v_total_discount,
    'total_vat', v_total_vat,
    'grand_total', v_grand_total
  );
end;
$$;
