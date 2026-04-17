import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
    <main className="min-h-screen bg-white px-4 py-10">
      <section className="mx-auto max-w-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-black/60">
          เข้าสู่ระบบ POS Bakery
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="password"
            />
          </div>
          {/* แสดง error จาก validation หรือ backend */}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  )
}
