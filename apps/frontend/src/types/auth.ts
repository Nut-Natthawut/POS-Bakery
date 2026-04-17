//หน้าตาข้อมูล auth
export type LoginRequest = {
  username: string
  password: string
}

export type AuthUser = {
  id: string
  username: string
  role: "ADMIN" | "STAFF"
}

export type LoginResponse = {
  message: string
  data: {
    token: string
    user: AuthUser
  }
}
