import { Router } from "express";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware";
import { createProduct, deleteProduct, getProducts, updateProduct, uploadProductImageToStorage } from "../services/product.service";
import { uploadProductImage } from "../middleware/upload.middleware";
import type { UpdateProductInput } from "../types/product.type";

const productRouter = Router();

const toNumber = (value: unknown) => {
    if(value === undefined || value === null || value === "") {
        return undefined
    }
    return Number(value)
}

productRouter.get("/", checkAuth, async (_req,res) => {
    try{
        const products = await getProducts();
        return res.status(200).json({
            message: "Products loaded successfully",
            data: products
        })
    }catch{
        return res.status(500).json({
            message: "Failed to load products"
        })
    }
})

productRouter.post("/",checkAuth,checkAdmin,
  uploadProductImage.single("image"),
  async (req, res) => {
    try {
      const {
        category_id,
        name,
        price,
        stock,
        vat_rate,
        discount_price
      } = req.body;

      if (
        !category_id ||
        !name ||
        price === undefined ||
        stock === undefined ||
        vat_rate === undefined
      ) {
        return res.status(400).json({
    message: "category_id, name, price, stock and vat_rate are required"
  });
}
      let imageUrl: string | null = null;

      if (req.file) {
        imageUrl = await uploadProductImageToStorage(req.file);
      }

      const product = await createProduct({
        category_id: String(category_id).trim(),
        name: String(name).trim(),
        price: Number(price),
        stock: Number(stock),
        vat_rate: Number(vat_rate),
        discount_price: toNumber(discount_price) ?? null,
        image_url: imageUrl
});
      return res.status(201).json({
        message: "Product created successfully",
        data: product
      });
    } catch {
  return res.status(500).json({
    message: "Failed to create product"
  });
}
  }
);

productRouter.put("/:id",checkAuth,checkAdmin,
  uploadProductImage.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const imageUrl = req.file
        ? await uploadProductImageToStorage(req.file)
        : undefined;

      const updatePayload: UpdateProductInput = {};

if (req.body.category_id !== undefined) {
  updatePayload.category_id = req.body.category_id;
}

if (req.body.name !== undefined) {
  updatePayload.name = req.body.name;
}

if (req.body.price !== undefined) {
  updatePayload.price = Number(req.body.price);
}

if (req.body.stock !== undefined) {
  updatePayload.stock = Number(req.body.stock);
}

if (req.body.vat_rate !== undefined) {
  updatePayload.vat_rate = Number(req.body.vat_rate);
}

if (req.body.discount_price !== undefined) {
  updatePayload.discount_price = toNumber(req.body.discount_price) ?? null;
}

if (imageUrl) {
  updatePayload.image_url = imageUrl;
}

    const product = await updateProduct(id as string, updatePayload);

    return res.status(200).json({
        message: "Product updated successfully",
        data: product
    });
    } catch {
      return res.status(500).json({
        message: "Failed to update product"
      });
    }
  }
);

productRouter.delete("/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteProduct(id as string);

    return res.status(200).json({
      message: "Product deleted successfully",
      data: result
    });
  } catch {
    return res.status(500).json({
      message: "Failed to delete product"
    });
  }
});

export default productRouter;