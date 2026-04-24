import { NavLink, useNavigate } from "react-router-dom"
import type { AuthUser } from "../types/auth"

type AppLayoutProps = {
  children: React.ReactNode
}

type NavItem = {
  label: string
  path: string
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate()

  // ดึงข้อมูล user ที่ login อยู่มาใช้กำหนดเมนู
  const authUser = JSON.parse(
    localStorage.getItem("authUser") || "null",
  ) as AuthUser | null

  // กำหนดเมนูสำหรับ admin
  const adminNavItems: NavItem[] = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
    { label: "Categories", path: "/categories" },
    { label: "Sales", path: "/sales" },
    { label: "Order History", path: "/orders/history" },
  ]

  // กำหนดเมนูสำหรับ staff
  const staffNavItems: NavItem[] = [
    { label: "Sales", path: "/sales" },
    { label: "Order History", path: "/orders/history" },
  ]

  // แสดงเมนูตาม role ของ user
  const navItems =
    authUser?.role === "ADMIN" ? adminNavItems : staffNavItems

  // ออกจากระบบแล้วกลับไปหน้า login
  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("authUser")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] xl:grid xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b px-4 py-4 xl:min-h-screen xl:border-b-0 xl:border-r">
        <div>
          <p className="text-sm text-black/45">POS Bakery</p>
          <h1 className="text-lg font-semibold">Back Office</h1>
          <p className="mt-1 text-sm text-black/55">
            {authUser?.username} ({authUser?.role})
          </p>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `shrink-0 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-black text-white"
                    : "border text-black/75 hover:bg-black/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-md border px-3 py-2 text-sm xl:mt-6"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 px-4 py-6 md:px-5 xl:px-6">
        <section className="min-w-0 w-full">{children}</section>
      </main>
    </div>
  )
}
