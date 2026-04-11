//ด่านตรวจ ก่อนเข้า route
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.type";

const jwtSecret = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

//เช็ค login มี token ไหม ก่อนเข้าห้อง
export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //ดึง token จาก header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: token is missing"
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: invalid token format"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;

    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized: token is invalid or expired"
    });
  }
};
//เช็ค admin
export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: user information not found"
    });
  }
// เช็คว่าใช่ admin ไหม
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden: admin access only"
    });
  }

  return next();
};
