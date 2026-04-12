//หน้าตาข้อมูลใน DB
export interface Category {
    id:string;
    name:string;
    created_at:string;
}

export interface CreateCategoryInput {
    name:string;
}
export interface UpdateCategoryInput {
    name?:string;
}