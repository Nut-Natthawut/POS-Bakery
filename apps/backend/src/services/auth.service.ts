//ส่วนของสมอง logic หลักของงาน
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase";
import type { AuthUser, JwtPayload } from "../types/auth.type";

const jwtSecret = process.env.JWT_SECRET!;
// หา user
export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, password_hash, role")
    .eq("username", username)
    .single();

  if (error || !data) {
    throw new Error("Invalid credentials");
  }

  const user = data as AuthUser;

// เช็ค password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

// สร้าง payload
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
// สร้าง token
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1d"
  });
// ส่ง token กับ user
  return {
    token,
    user: payload
  };
};
