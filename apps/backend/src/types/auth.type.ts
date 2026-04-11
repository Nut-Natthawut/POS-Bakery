//ข้อมูลที่ฉันจะรับ/ส่ง หน้าตาเป็นยังไง รูปทรงข้อมูล / interface / type
export type UserRole = "ADMIN" | "STAFF";
export interface AuthUser {
    id : string
    username: string
    password_hash: string;
    role: UserRole;
}
export interface JwtPayload {
    id: string;
    username: string;
    role: UserRole;
}