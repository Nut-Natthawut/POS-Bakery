import { useEffect, useMemo, useState } from "react"
import { ReceiptModal } from "../components/ReceiptModal"
import { getProducts } from "../services/productApi"
import { createOrder } from "../services/orderApi"
import type { Product } from "../types/product"
import type { CartItem } from "../types/order"
import type { ReceiptData } from "../types/receipt"
import { getReceipt } from "../services/receiptApi"

export const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // โหลดสินค้าล่าสุดจาก backend
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getProducts();
      setProducts(result.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load products",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // เพิ่มสินค้าเข้าตะกร้า
  const handleAddToCart = (product: Product) => {
    setError("");
    setSuccess("");

    if (product.stock <= 0) {
      setError("Out of stock");
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product_id === product.id,
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            discount_price: product.discount_price,
            vat_rate: product.vat_rate,
            stock: product.stock,
            image_url: product.image_url,
            quantity: 1,
          },
        ];
      }

      if (existingItem.quantity >= existingItem.stock) {
        return currentItems;
      }

      return currentItems.map((item) =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  // เพิ่มจำนวนในตะกร้า
  const handleIncreaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product_id !== productId) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  // ลดจำนวนในตะกร้า
  const handleDecreaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // ลบสินค้าออกจากตะกร้า
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product_id !== productId),
    );
  };

  // คำนวณยอดใน frontend เพื่อแสดงก่อน checkout
  const cartSummary = useMemo(() => {
    return cartItems.reduce(
      (summary, item) => {
        const unitDiscount = item.discount_price ?? 0;
        const unitPriceAfterDiscount = item.price - unitDiscount;
        const vatAmount = (unitPriceAfterDiscount * item.vat_rate) / 100;

        summary.subtotal += unitPriceAfterDiscount * item.quantity;
        summary.totalDiscount += unitDiscount * item.quantity;
        summary.totalVat += vatAmount * item.quantity;
        summary.grandTotal +=
          (unitPriceAfterDiscount + vatAmount) * item.quantity;

        return summary;
      },
      {
        subtotal: 0,
        totalDiscount: 0,
        totalVat: 0,
        grandTotal: 0,
      },
    );
  }, [cartItems]);

  const availableProductsLabel = `${products.length} menu items`;
  const cartItemsLabel = `${cartItems.length} items in cart`;
  const totalQuantityLabel = `${cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )} qty`;

  // ส่ง product_id และ quantity ไป backend
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }

    try {
      setIsCheckingOut(true);
      setError("");
      setSuccess("");

      const result = await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      // ถ้าสำเร็จให้ล้างตะกร้าและโหลด stock ใหม่
      setSuccess(result.message);
      setCartItems([]);
      await loadProducts();

      // ใช้ order_id ที่เพิ่งสร้างไปดึงใบเสร็จ
      try {
        const receiptResult = await getReceipt(result.data.order_id);
        setReceipt(receiptResult.data);
        setIsReceiptOpen(true);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load receipt",
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <section className="space-y-6">
          <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-black/45">Sales Management</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                    Sales
                  </h1>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-black/55">
                  เลือกสินค้า เพิ่มลงตะกร้า และ checkout เพื่อสร้างบิลขายพร้อมอัปเดตสต็อกล่าสุด
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Menu
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{availableProductsLabel}</p>
                  </div>

                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Cart
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{cartItemsLabel}</p>
                  </div>

                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Quantity
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{totalQuantityLabel}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-md border border-black/10 bg-[#fafaf8] p-4">
                <div>
                  <p className="text-sm font-medium text-black/50">Checkout Status</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#1d1d1f]">
                    พร้อมขายและปิดบิลจากหน้าจอเดียว
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-black/55">
                    สต็อกในรายการสินค้าจะอัปเดตตามข้อมูลล่าสุดจากระบบก่อน checkout ทุกครั้ง
                  </p>
                </div>

                <div className="rounded-md border border-black/10 bg-white px-4 py-3">
                  <p className="text-sm text-black/55">Grand Total</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {cartSummary.grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </p>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Products</h2>

              {isLoading ? (
                <p className="text-sm text-black/60">Loading products...</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-md border border-black/10 bg-[#fcfcfb] p-4 shadow-sm space-y-3"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-40 w-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-md bg-black/5 text-sm text-black/50">
                        No image
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.stock <= 5 ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                            Low stock
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-black/60">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <div className="text-sm space-y-1">
                      <p>Price: {product.price}</p>
                      <p>Discount: {product.discount_price ?? 0}</p>
                      <p>VAT: {product.vat_rate}%</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                      Add to cart
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-md border border-black/10 bg-white p-4 shadow-sm space-y-4 h-fit">
              <h2 className="text-xl font-semibold">Cart</h2>

              {cartItems.length === 0 ? (
                <p className="text-sm text-black/60">No items in cart</p>
              ) : null}

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="rounded-md border border-black/10 bg-black/[0.02] p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-black/60">
                          Stock: {item.stock}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.product_id)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecreaseQuantity(item.product_id)}
                        className="rounded-md border px-3 py-1"
                      >
                        -
                      </button>

                      <span className="min-w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncreaseQuantity(item.product_id)}
                        disabled={item.quantity >= item.stock}
                        className="rounded-md border px-3 py-1 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{cartSummary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span>{cartSummary.totalDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total VAT</span>
                  <span>{cartSummary.totalVat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-semibold text-base">
                  <span>Grand Total</span>
                  <span>{cartSummary.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckingOut}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {isCheckingOut ? "Checking out..." : "Checkout"}
              </button>
            </aside>
          </div>
      </section>
      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receipt}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  );
};
