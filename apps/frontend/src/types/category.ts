export type Category = {
  id: string
  name: string
  created_at: string
}

export type GetCategoriesResponse = {
  message: string
  data: Category[]
}

export type CreateCategoryResponse = {
  message: string
  data: Category
}

export type UpdateCategoryResponse = {
  message: string
  data: Category
}

export type DeleteCategoryResponse = {
  message: string
  data: {
    id: string
  }
}