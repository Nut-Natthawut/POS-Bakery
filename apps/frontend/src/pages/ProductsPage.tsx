import { useEffect, useState } from "react"
import { getCategories } from "../services/categoryApi"
import { getProducts } from "../services/productApi"
import type { Category } from "../types/category"
import type { Product } from "../types/product"

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-black/45">Menu Management</p>
        <h1 className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
          Products
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-black/55">
          จัดการเมนูสินค้า ราคา สต็อก ส่วนลด VAT และรูปภาพสินค้า
        </p>
      </div>

      {/* แสดง error จาก backend หรือการโหลดข้อมูล */}
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
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
                  <td className="py-2 pr-4">
                    {product.discount_price ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
