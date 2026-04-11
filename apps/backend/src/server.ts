import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import { checkAdmin, checkAuth } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
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

// เช็คว่า login แล้ว
app.get("/profile", checkAuth, (req,res) => {
  return res.status(200).json({
    message: "Authenticated user profile loaded successfully",
    data: req.user
  })
})
// เช็คว่า login แล้วเป็น admin ไหม
app.get("/admin/dashboard", checkAuth, checkAdmin, (req,res) => {
  return res.status(200).json({
    message: "Admin dashboard loaded successfully",
    data: {
      user: req.user,
    }
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

