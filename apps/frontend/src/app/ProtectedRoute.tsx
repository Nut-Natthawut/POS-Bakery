import { Navigate } from "react-router-dom"

type AuthUser = {
  id: string
  username: string
  role: "ADMIN" | "STAFF"
}

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRoles?: AuthUser["role"][]
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken")
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null") as AuthUser | null

  if (!token || !authUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    const fallbackPath = authUser.role === "STAFF" ? "/sales" : "/dashboard"

    return <Navigate to={fallbackPath} replace />
  }



  return children
}
