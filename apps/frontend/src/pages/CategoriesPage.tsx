import { useEffect, useState } from "react"
import { AlertCircle, FolderPlus, PencilLine, RefreshCcw, Trash2 } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableShell } from "../components/ui/DataTableShell"
import { StatCard } from "../components/ui/StatCard"
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryApi"
import type { Category } from "../types/category"

export const CategoriesPage = () => {
  //state สำหรับเก็บข้อมูล
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  //state สำหรับเปิด/ปิดฟอร์ม
  const [isFormOpen, setIsFormOpen] = useState(false)
  //state สำหรับเก็บข้อมูลที่กำลังแก้ไข
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")

  const categoryCountLabel = `${categories.length} groups`
  const latestCategoryDate =
    categories.length > 0
      ? new Date(categories[0].created_at).toLocaleDateString()
      : "-"

  // โหลดหมวดหมู่ทั้งหมดเพื่อแสดงในตาราง
  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError("")

      const result = await getCategories()
      setCategories(result.data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Load categories failed",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // โหลดข้อมูลครั้งแรกเมื่อเข้า CategoriesPage
  useEffect(() => {
    loadCategories()
  }, [])

  // ล้างค่าฟอร์ม
  const clearForm = () => {
    setName("")
  }

  // เปิดฟอร์มเพิ่มหมวดหมู่
  const openCreateForm = () => {
    clearForm()
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  // เปิดฟอร์มแก้ไขหมวดหมู่
  const openEditForm = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setIsFormOpen(true)
  }

  // ปิดฟอร์มและล้าง state
  const closeForm = () => {
    clearForm()
    setEditingCategory(null)
    setIsFormOpen(false)
  }

  // เพิ่ม/แก้ไขหมวดหมู่
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ตรวจสอบชื่อหมวดหมู่ก่อนส่งไป backend
    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: name.trim() })
      } else {
        await createCategory({ name: name.trim() })
      }

      closeForm()
      await loadCategories()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Save category failed",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ลบหมวดหมู่
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this category?")

    if (!confirmed) {
      return
    }

    try {
      setError("")
      await deleteCategory(id)
      await loadCategories()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Delete category failed",
      )
    }
  }

  return (
    <section className="space-y-6">
      <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <CardContent className="px-5 py-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-black/45">Menu Management</p>
                <h1 className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
                  Categories
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-black/55">
                  จัดการหมวดหมู่สินค้าสำหรับใช้ในเมนูและฟอร์มสินค้า
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <StatCard
                  label="Categories"
                  value={categoryCountLabel}
                  helperText="จำนวนหมวดหมู่ที่ใช้งานอยู่ในระบบ"
                />
                <StatCard
                  label="Latest Update"
                  value={latestCategoryDate}
                  helperText="วันที่ล่าสุดจากรายการหมวดหมู่ปัจจุบัน"
                />
              </div>
            </div>

            <Card className="rounded-lg border border-black/8 bg-[#fafaf8] py-0 shadow-none">
              <CardContent className="flex h-full flex-col justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-black/50">
                    Category Control
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal text-[#1d1d1f]">
                    เพิ่มและแก้ไขหมวดหมู่ให้พร้อมใช้งาน
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-black/55">
                    หมวดหมู่เหล่านี้จะถูกใช้ในหน้าจัดการสินค้าเพื่อแยกประเภทเมนูอย่างเป็นระเบียบ
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={loadCategories}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCcw className={isLoading ? "animate-spin" : ""} />
                    Refresh Categories
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    onClick={openCreateForm}
                    className="w-full"
                  >
                    <FolderPlus />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="size-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isFormOpen ? (
        <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="gap-2 px-5 pt-5">
            <CardTitle className="text-lg font-semibold tracking-normal">
              {editingCategory ? "Edit Category" : "Add Category"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Drink"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={closeForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
          <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
          <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
        </div>
      ) : (
        <DataTableShell
          title="Category List"
          description="จัดการหมวดหมู่ที่ใช้ในเมนูสินค้า"
        >
          {categories.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-black/60">
              ยังไม่มีหมวดหมู่สินค้าในระบบ
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:hidden">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="rounded-lg border border-black/8 py-0 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >
                    <CardContent className="px-4 py-4">
                      <p className="font-medium">{category.name}</p>
                      <p className="mt-1 text-sm text-black/60">
                        {new Date(category.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(category)}
                        >
                          <PencilLine />
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Table className="hidden min-w-full md:table">
                <TableHeader>
                  <TableRow className="bg-black/[0.03] hover:bg-black/[0.03]">
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Created At
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="px-4 py-3 font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {new Date(category.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="space-x-2 px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(category)}
                        >
                          <PencilLine />
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DataTableShell>
      )}
    </section>
  )
}
