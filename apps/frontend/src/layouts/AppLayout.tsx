import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen bg-background text-foreground xl:grid xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-sidebar-border bg-sidebar/80 px-4 py-4 backdrop-blur-xl xl:min-h-screen xl:border-b-0 xl:border-r">
        <div>
          <p className="text-sm text-muted-foreground">POS Bakery</p>
          <h1 className="text-lg font-semibold">Back Office</h1>
          <p className="mt-1 text-sm text-muted-foreground">
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
                    ? "bg-primary text-primary-foreground"
                    : "border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="mt-4 xl:mt-6"
        >
          Logout
        </Button>
      </aside>

      <main className="min-w-0 px-4 py-6 md:px-5 xl:px-6">
        <section className="min-w-0 w-full">{children}</section>
      </main>
    </div>
  )
}
