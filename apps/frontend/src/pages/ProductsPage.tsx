import { useEffect, useState } from "react"
import { AlertCircle, PackagePlus, PencilLine, RefreshCcw } from "lucide-react"
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
import { getCategories } from "../services/categoryApi"
import { createProduct, getProducts, updateProduct } from "../services/productApi"
import type { Category } from "../types/category"
import type { Product } from "../types/product"

export const ProductsPage = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null") as {
    id: string
    username: string
    role: "ADMIN" | "STAFF"
  } | null
  const isAdmin = authUser?.role === "ADMIN"

  // state เก็บรายการสินค้า, หมวดหมู่, error และ loading
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // state สำหรับเปิด/ปิดฟอร์ม และบอกว่ากำลังเพิ่มหรือแก้ไขสินค้า
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // state เก็บข้อมูลฟอร์ม
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [vatRate, setVatRate] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  // โหลดรายการสินค้าเพื่อแสดงในตาราง
  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError("")

      const result = await getProducts()
      setProducts(result.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Load products failed")
    } finally {
      setIsLoading(false)
    }
  }

  // โหลดหมวดหมู่เพื่อแปลง category_id เป็นชื่อหมวดหมู่
  const loadCategories = async () => {
    try {
      const result = await getCategories()
      setCategories(result.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Load categories failed")
    }
  }

  // โหลดข้อมูลครั้งแรกเมื่อเข้า ProductsPage
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  // หา category name จาก category_id ที่ product เก็บไว้
  const getCategoryName = (selectedCategoryId: string) => {
    const category = categories.find((item) => item.id === selectedCategoryId)

    return category?.name || "-"
  }

  const lowStockProducts = products.filter((product) => product.stock <= 5)
  const productCountLabel = `${products.length} items`
  const categoryCountLabel = `${categories.length} groups`
  const lowStockLabel = `${lowStockProducts.length} low stock`

  // ล้างค่าฟอร์มหลังบันทึกหรือกดยกเลิก
  const clearForm = () => {
    setName("")
    setCategoryId("")
    setPrice("")
    setStock("")
    setVatRate("")
    setDiscountPrice("")
    setImageFile(null)
  }

  // เปิดฟอร์มสำหรับเพิ่มสินค้าใหม่
  const openCreateForm = () => {
    if (!isAdmin) {
      setError("Forbidden: admin access only")
      return
    }

    clearForm()
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  // เปิดฟอร์มสำหรับแก้ไขสินค้า และเติมค่าจากสินค้าที่เลือก
  const openEditForm = (product: Product) => {
    if (!isAdmin) {
      setError("Forbidden: admin access only")
      return
    }

    setEditingProduct(product)
    setName(product.name)
    setCategoryId(product.category_id)
    setPrice(String(product.price))
    setStock(String(product.stock))
    setVatRate(String(product.vat_rate))
    setDiscountPrice(
      product.discount_price === null ? "" : String(product.discount_price)
    )
    setImageFile(null)
    setIsFormOpen(true)
  }

  // ปิดฟอร์มและล้าง state ที่เกี่ยวข้อง
  const closeForm = () => {
    clearForm()
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  // ฟังก์ชันบันทึกหรือแก้ไขสินค้า
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ตรวจสอบข้อมูลที่ backend ต้องการก่อน submit
    if (!name.trim() || !categoryId || !price || !stock || !vatRate) {
      setError("Please fill required fields")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      const formData = new FormData()

      // key ต้องตรงกับ req.body ที่ backend อ่าน
      formData.append("category_id", categoryId)
      formData.append("name", name.trim())
      formData.append("price", price)
      formData.append("stock", stock)
      formData.append("vat_rate", vatRate)

      if (discountPrice) {
        formData.append("discount_price", discountPrice)
      }

      // key image ต้องตรงกับ uploadProductImage.single("image") ใน backend
      if (imageFile) {
        formData.append("image", imageFile)
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
      } else {
        await createProduct(formData)
      }

      closeForm()

      // โหลดรายการใหม่เพื่อให้หน้าแสดงข้อมูลล่าสุด
      await loadProducts()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Save product failed")
    } finally {
      setIsSubmitting(false)
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
                <h1 className="text-3xl font-semibold tracking-normal text-[#1d1d1f]">
                  Products
                </h1>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-black/55">
                จัดการเมนูสินค้า ราคา สต็อก ส่วนลด VAT และรูปภาพสินค้าให้พร้อมขายในหน้าร้าน
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <StatCard
                  label="Products"
                  value={productCountLabel}
                  helperText="จำนวนสินค้าในระบบปัจจุบัน"
                />
                <StatCard
                  label="Categories"
                  value={categoryCountLabel}
                  helperText="หมวดหมู่ที่พร้อมใช้งาน"
                />
                <StatCard
                  label="Attention"
                  value={lowStockLabel}
                  helperText="สินค้าใกล้หมดที่ควรเติมสต็อก"
                />
              </div>
            </div>

            <Card className="rounded-lg border border-black/8 bg-[#fafaf8] py-0 shadow-none">
              <CardContent className="flex h-full flex-col justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-black/50">
                    Product Control
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal text-[#1d1d1f]">
                    {isAdmin ? "จัดการสินค้าและอัปเดตราคาได้ทันที" : "ดูข้อมูลสินค้าปัจจุบัน"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-black/55">
                    ตารางด้านล่างแสดงสถานะสินค้าปัจจุบันทั้งหมดของระบบพร้อมหมวดหมู่ สต็อก และส่วนลด
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={loadProducts}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCcw className={isLoading ? "animate-spin" : ""} />
                    Refresh Products
                  </Button>

                  {isAdmin ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={openCreateForm}
                      className="w-full"
                    >
                      <PackagePlus />
                      Add Product
                    </Button>
                  ) : (
                    <p className="rounded-lg border border-black/10 bg-white px-3 py-3 text-sm text-black/60">
                      บัญชีนี้ดูรายการสินค้าได้อย่างเดียว
                    </p>
                  )}
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
            <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-normal">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </CardTitle>
                <p className="text-sm leading-6 text-black/55">
                  กรอกข้อมูลสินค้าให้ครบก่อนบันทึกเข้าระบบ
                </p>
              </div>

              <div className="rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2 text-sm text-black/60">
                รูปแบบนี้เหมาะกับ desktop และ tablet มากกว่า mobile
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="กาแฟดำไทย"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input
                    id="product-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input
                    id="product-stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    type="number"
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-vat-rate">VAT Rate</Label>
                  <Input
                    id="product-vat-rate"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    type="number"
                    placeholder="7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-discount-price">Discount Price</Label>
                  <Input
                    id="product-discount-price"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    type="number"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-image">Product Image</Label>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label
                    htmlFor="product-image"
                    className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Choose Image
                  </label>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />

                  <span className="text-sm text-black/60">
                    {imageFile ? imageFile.name : "No file selected"}
                  </span>
                </div>

                <p className="text-xs text-black/45">
                  รองรับไฟล์ JPG, PNG หรือ WEBP
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
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
          title="Product List"
          description="รายการเมนูสินค้าทั้งหมดในระบบ"
        >
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-black/60">
              ยังไม่มีสินค้าในระบบ
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:hidden">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="rounded-lg border border-black/8 bg-[#fcfcfb] py-0 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >
                    <CardContent className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-20 w-20 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-black/5 text-xs text-black/40">
                            No image
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-base font-semibold">
                              {product.name}
                            </h3>
                            {product.stock <= 5 ? (
                              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                Low stock
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-black/60">
                            {getCategoryName(product.category_id)}
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/75">
                            <p>Price: {product.price}</p>
                            <p>Stock: {product.stock}</p>
                            <p>VAT: {product.vat_rate}</p>
                            <p>Discount: {product.discount_price ?? "-"}</p>
                          </div>
                          {isAdmin ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => openEditForm(product)}
                              className="mt-4"
                            >
                              <PencilLine />
                              Edit
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Table className="hidden w-full table-fixed xl:table">
                <TableHeader>
                  <TableRow className="bg-black/[0.03] hover:bg-black/[0.03]">
                    <TableHead className="w-24 px-4 py-3 font-medium text-black/65">
                      Image
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Category
                    </TableHead>
                    <TableHead className="w-28 px-4 py-3 font-medium text-black/65">
                      Price
                    </TableHead>
                    <TableHead className="w-28 px-4 py-3 font-medium text-black/65">
                      Stock
                    </TableHead>
                    <TableHead className="w-24 px-4 py-3 font-medium text-black/65">
                      VAT
                    </TableHead>
                    <TableHead className="px-4 py-3 font-medium text-black/65">
                      Discount
                    </TableHead>
                    {isAdmin ? (
                      <TableHead className="w-32 px-4 py-3 font-medium text-black/65">
                        Actions
                      </TableHead>
                    ) : null}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-4 py-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-black/40">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        <div className="space-y-1">
                          <p className="truncate">{product.name}</p>
                          {product.stock <= 5 ? (
                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Low stock
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {getCategoryName(product.category_id)}
                      </TableCell>
                      <TableCell className="px-4 py-3">{product.price}</TableCell>
                      <TableCell className="px-4 py-3">{product.stock}</TableCell>
                      <TableCell className="px-4 py-3">{product.vat_rate}</TableCell>
                      <TableCell className="px-4 py-3">
                        {product.discount_price ?? "-"}
                      </TableCell>
                      {isAdmin ? (
                        <TableCell className="px-4 py-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(product)}
                          >
                            <PencilLine />
                            Edit
                          </Button>
                        </TableCell>
                      ) : null}
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
