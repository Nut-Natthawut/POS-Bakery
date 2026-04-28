import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "../services/authApi"

export const LoginPage = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ตรวจสอบข้อมูลก่อนยิง API
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password")
      return
    }

    try {
      // เริ่มสถานะกำลัง login
      setError("")
      setIsLoading(true)

      // ส่ง username/password ไปที่ backend
      const result = await login({ username, password })

      // เก็บ token และข้อมูล user หลัง login สำเร็จ
      localStorage.setItem("accessToken", result.data.token)
      localStorage.setItem("authUser", JSON.stringify(result.data.user))

      // ไปหน้า dashboard
      navigate("/dashboard")
    } catch (error) {
      // แสดง error ถ้า login ไม่สำเร็จ จาก backend
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      // ปิดสถานะ loading
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center">
        <Card className="w-full rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <CardHeader className="gap-2 px-6 pt-6">
            <p className="text-xs font-medium uppercase tracking-normal text-black/45">
              POS Bakery
            </p>
            <CardTitle className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
              Login
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-black/55">
              เข้าสู่ระบบเพื่อจัดการสินค้า การขาย และภาพรวมของร้าน
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
