export type Category = {
  id: string
  name: string
  created_at: string
}

export type CategoriesResponse = {
  message: string
  data: Category[]
}
