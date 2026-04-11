//เส้นทาง ||  ประตู API
import { Router } from "express";
import { loginUser } from "../services/auth.service";

const authRouter = Router();
// รับ request
authRouter.post("/login", async (req,res) => {
    try{
        const { username, password } = req.body
        // validate input เบื้องต้น
        if(!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }
        // ส่งไป process ที่ auth.service
        const result = await loginUser(username, password);
        // ส่ง response กลับ
        return res.status(200).json({
            message:"Login successful",
            data: result
        })
    }catch{
        return res.status(401).json({
            message:"Invalid username or password"
        })

    }
})

export default authRouter