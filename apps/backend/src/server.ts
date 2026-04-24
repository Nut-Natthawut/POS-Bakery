import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import categoryRouter from './routes/category.route';
import productRouter from './routes/product.route';
import orderRouter from './routes/order.route';
import dashboardRouter from './routes/dashboard.route';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : [];

app.use(cors({
  // ถ้า production ตั้ง FRONTEND_URL จะอนุญาตเฉพาะ frontend ที่กำหนดไว้
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json());


app.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "Backend server is running",
    data: {
      status: "ok"
    }
  });
});
// เรียกใช้ authRouter จาก routes/auth.route.ts
app.use(authRouter)
app.use("/categories",categoryRouter)
app.use("/products",productRouter)
app.use("/orders",orderRouter)
app.use("/dashboard",dashboardRouter)

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
