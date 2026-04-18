import { useEffect, useState } from "react"
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-black/45">Menu Management</p>
          <h1 className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
            Products
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-black/55">
            จัดการเมนูสินค้า ราคา สต็อก ส่วนลด VAT และรูปภาพสินค้า
          </p>
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Add Product
          </button>
        ) : null}
      </div>

      {/* แสดง error จาก backend หรือการโหลดข้อมูล */}
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-md border p-4"
        >
          <h2 className="text-lg font-semibold">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full rounded-md border px-3 py-2"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Price"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="Stock"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            type="number"
            placeholder="VAT rate"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            type="number"
            placeholder="Discount price"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

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
        <p className="text-sm text-black/60">Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          {/* ตารางรายการสินค้า */}
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Image</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2 pr-4">VAT</th>
                <th className="py-2 pr-4">Discount</th>
                {isAdmin ? <th className="py-2 pr-4">Actions</th> : null}
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2 pr-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-black/40">No image</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 font-medium">{product.name}</td>
                  <td className="py-2 pr-4">
                    {getCategoryName(product.category_id)}
                  </td>
                  <td className="py-2 pr-4">{product.price}</td>
                  <td className="py-2 pr-4">{product.stock}</td>
                  <td className="py-2 pr-4">{product.vat_rate}</td>
                  <td className="py-2 pr-4">{product.discount_price ?? "-"}</td>
                  {isAdmin ? (
                    <td className="py-2 pr-4">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
