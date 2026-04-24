import { useEffect, useState } from "react"
import { DataTableShell } from "../components/ui/DataTableShell"
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
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId)

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
      <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-black/45">Menu Management</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                Products
              </h1>
            </div>

            <p className="max-w-3xl text-sm leading-6 text-black/55">
              จัดการเมนูสินค้า ราคา สต็อก ส่วนลด VAT และรูปภาพสินค้าให้พร้อมขายในหน้าร้าน
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                  Products
                </p>
                <p className="mt-2 text-2xl font-semibold">{productCountLabel}</p>
              </div>

              <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                  Categories
                </p>
                <p className="mt-2 text-2xl font-semibold">{categoryCountLabel}</p>
              </div>

              <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                  Attention
                </p>
                <p className="mt-2 text-2xl font-semibold">{lowStockLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-md border border-black/10 bg-[#fafaf8] p-4">
            <div>
              <p className="text-sm font-medium text-black/50">
                Product Control
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#1d1d1f]">
                {isAdmin ? "จัดการสินค้าและอัปเดตราคาได้ทันที" : "ดูข้อมูลสินค้าปัจจุบัน"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/55">
                ตารางด้านล่างแสดงสถานะสินค้าปัจจุบันทั้งหมดของระบบพร้อมหมวดหมู่ สต็อก และส่วนลด
              </p>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={openCreateForm}
                className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white"
              >
                Add Product
              </button>
            ) : (
              <p className="rounded-md border border-black/10 bg-white px-3 py-3 text-sm text-black/60">
                บัญชีนี้ดูรายการสินค้าได้อย่างเดียว
              </p>
            )}
          </div>
        </div>
      </section>

      {/* แสดง error จาก backend หรือการโหลดข้อมูล */}
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-md border border-black/10 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-sm text-black/55">
                กรอกข้อมูลสินค้าให้ครบก่อนบันทึกเข้าระบบ
              </p>
            </div>

            <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-sm text-black/60">
              รูปแบบนี้เหมาะกับ desktop และ tablet มากกว่า mobile
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-black/70">
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กาแฟดำไทย"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-black/70">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black/70">
                Price
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="40"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black/70">
                Stock
              </label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                placeholder="10"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black/70">
                VAT Rate
              </label>
              <input
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                type="number"
                placeholder="7"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black/70">
                Discount Price
              </label>
              <input
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                type="number"
                placeholder="5"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">
              Product Image
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>

              <span className="text-sm text-black/60">
                {imageFile ? imageFile.name : "No file selected"}
              </span>
            </div>

            <p className="text-xs text-black/45">
              รองรับไฟล์ JPG, PNG หรือ WEBP
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* แสดง loading ระหว่างโหลดสินค้า */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-md border bg-black/5" />
          <div className="h-16 animate-pulse rounded-md border bg-black/5" />
          <div className="h-16 animate-pulse rounded-md border bg-black/5" />
        </div>
      ) : (
        <DataTableShell
          title="Product List"
          description="รายการเมนูสินค้าทั้งหมดในระบบ"
        >
          {products.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-black/60">
              ยังไม่มีสินค้าในระบบ
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:hidden">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-md border border-black/10 bg-[#fcfcfb] p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-20 w-20 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-black/5 text-xs text-black/40">
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
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="mt-4 rounded-md border border-black/15 px-3 py-2 text-sm hover:bg-black/5"
                          >
                            Edit
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <table className="hidden w-full table-fixed border-collapse text-left text-sm xl:table">
                <thead>
                  <tr className="border-b bg-black/[0.03]">
                    <th className="w-24 px-4 py-3 font-medium text-black/65">Image</th>
                    <th className="px-4 py-3 font-medium text-black/65">Name</th>
                    <th className="px-4 py-3 font-medium text-black/65">
                      Category
                    </th>
                    <th className="w-28 px-4 py-3 font-medium text-black/65">Price</th>
                    <th className="w-28 px-4 py-3 font-medium text-black/65">Stock</th>
                    <th className="w-24 px-4 py-3 font-medium text-black/65">VAT</th>
                    <th className="px-4 py-3 font-medium text-black/65">
                      Discount
                    </th>
                    {isAdmin ? (
                      <th className="w-32 px-4 py-3 font-medium text-black/65">
                        Actions
                      </th>
                    ) : null}
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-black/40">No image</span>
                      )}
                    </td>
                      <td className="px-4 py-3 font-medium">
                        <div className="space-y-1">
                          <p className="truncate">{product.name}</p>
                          {product.stock <= 5 ? (
                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Low stock
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getCategoryName(product.category_id)}
                      </td>
                      <td className="px-4 py-3">{product.price}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">{product.vat_rate}</td>
                      <td className="px-4 py-3">
                        {product.discount_price ?? "-"}
                      </td>
                      {isAdmin ? (
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="rounded-md border border-black/15 px-3 py-1 text-sm hover:bg-black/5"
                          >
                            Edit
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </DataTableShell>
      )}
    </section>
  );
}
