import { randomUUID } from "crypto";
import { supabase } from "../lib/supabase";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput
} from "../types/product.type";

//หน้าตาข้อมูลใน DB
const productSelect = `
  id,
  category_id,
  name,
  price,
  stock,
  vat_rate,
  discount_price,
  image_url,
  created_at
`;

//get all products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load products");
  }

  return data as Product[];
};

//upload product image to storage
export const uploadProductImageToStorage = async (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExtension}`;
  const filePath = `menus/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    throw new Error("Failed to upload product image");
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

//create product
export const createProduct = async (input: CreateProductInput) => {
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: input.category_id,
      name: input.name,
      price: input.price,
      stock: input.stock,
      vat_rate: input.vat_rate,
      discount_price: input.discount_price ?? null,
      image_url: input.image_url ?? null
    })
    .select(productSelect)
    .single();

  if (error) {
    throw new Error("Failed to create product");
  }

  return data as Product;
};

//update product
export const updateProduct = async (
  id: string,
  input: UpdateProductInput
) => {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select(productSelect)
    .single();

  if (error) {
    throw new Error("Failed to update product");
  }

  return data as Product;
};

//delete product
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Failed to delete product");
  }

  return {
    id
  };
};
