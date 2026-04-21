import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { createOrder } from "../services/order.service";
import { getReceiptByOrderId } from "../services/receipt.service";

const orderRouter = Router();

// สร้าง order ใหม่จากรายการสินค้าในตะกร้า
orderRouter.post("/", checkAuth, async (req, res) => {
  try {
    const { items } = req.body;

    // ตรวจสอบว่า frontend ส่งรายการสินค้ามาจริง
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required"
      });
    }

    // ส่ง userId และ items ไปให้ service เรียก RPC create_order
    const order = await createOrder(req.user!.id, { items });

    return res.status(201).json({
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";

    // error กลุ่มนี้เป็นปัญหาจากข้อมูลที่ส่งมา จึงตอบ 400
    const statusCode =
      message.includes("Insufficient stock") ||
      message.includes("required") ||
      message.includes("Quantity") ||
      message.includes("Product not found")
        ? 400
        : 500;

    return res.status(statusCode).json({
      message
    });
  }
});

// ดึงข้อมูลใบเสร็จจาก order_id
orderRouter.get("/:id/receipt", checkAuth, async (req, res) => {
  try {
    const receipt = await getReceiptByOrderId(req.params.id as string);

    return res.status(200).json({
      message: "Receipt fetched successfully",
      data: receipt
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch receipt";

    const statusCode =
      message.includes("not found") ? 404 : 500;

    return res.status(statusCode).json({
      message
    });
  }
});

export default orderRouter;
