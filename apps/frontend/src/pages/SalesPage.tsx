import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, Minus, Plus, RefreshCcw, ShoppingCart, Trash2 } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReceiptModal } from "../components/ReceiptModal"
import { StatCard } from "../components/ui/StatCard"
import { getProducts } from "../services/productApi"
import { createOrder } from "../services/orderApi"
import type { Product } from "../types/product"
import type { CartItem } from "../types/order"
import type { ReceiptData } from "../types/receipt"
import { getReceipt } from "../services/receiptApi"

export const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // โหลดสินค้าล่าสุดจาก backend
  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError("")

      const result = await getProducts()
      setProducts(result.data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load products",
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // เพิ่มสินค้าเข้าตะกร้า
  const handleAddToCart = (product: Product) => {
    setError("")
    setSuccess("")

    if (product.stock <= 0) {
      setError("Out of stock")
      return
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product_id === product.id,
      )

      if (!existingItem) {
        return [
          ...currentItems,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            discount_price: product.discount_price,
            vat_rate: product.vat_rate,
            stock: product.stock,
            image_url: product.image_url,
            quantity: 1,
          },
        ]
      }

      if (existingItem.quantity >= existingItem.stock) {
        return currentItems
      }

      return currentItems.map((item) =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })
  }

  // เพิ่มจำนวนในตะกร้า
  const handleIncreaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product_id !== productId) {
          return item
        }

        if (item.quantity >= item.stock) {
          return item
        }

        return { ...item, quantity: item.quantity + 1 }
      }),
    )
  }

  // ลดจำนวนในตะกร้า
  const handleDecreaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  // ลบสินค้าออกจากตะกร้า
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product_id !== productId),
    )
  }

  // คำนวณยอดใน frontend เพื่อแสดงก่อน checkout
  const cartSummary = useMemo(() => {
    return cartItems.reduce(
      (summary, item) => {
        const unitDiscount = item.discount_price ?? 0
        const unitPriceAfterDiscount = item.price - unitDiscount
        const vatAmount = (unitPriceAfterDiscount * item.vat_rate) / 100

        summary.subtotal += unitPriceAfterDiscount * item.quantity
        summary.totalDiscount += unitDiscount * item.quantity
        summary.totalVat += vatAmount * item.quantity
        summary.grandTotal +=
          (unitPriceAfterDiscount + vatAmount) * item.quantity

        return summary
      },
      {
        subtotal: 0,
        totalDiscount: 0,
        totalVat: 0,
        grandTotal: 0,
      },
    )
  }, [cartItems])

  const availableProductsLabel = `${products.length} menu items`
  const cartItemsLabel = `${cartItems.length} items in cart`
  const totalQuantityLabel = `${cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )} qty`

  // ส่ง product_id และ quantity ไป backend
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty")
      return
    }

    try {
      setIsCheckingOut(true)
      setError("")
      setSuccess("")

      const result = await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      })

      // ถ้าสำเร็จให้ล้างตะกร้าและโหลด stock ใหม่
      setSuccess(result.message)
      setCartItems([])
      await loadProducts()

      // ใช้ order_id ที่เพิ่งสร้างไปดึงใบเสร็จ
      try {
        const receiptResult = await getReceipt(result.data.order_id)
        setReceipt(receiptResult.data)
        setIsReceiptOpen(true)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load receipt",
        )
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <section className="space-y-6">
        <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardContent className="px-5 py-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-black/45">Sales Management</p>
                  <h1 className="text-3xl font-semibold tracking-normal text-[#1d1d1f]">
                    Sales
                  </h1>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-black/55">
                  เลือกสินค้า เพิ่มลงตะกร้า และ checkout เพื่อสร้างบิลขายพร้อมอัปเดตสต็อกล่าสุด
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                  <StatCard
                    label="Menu"
                    value={availableProductsLabel}
                    helperText="รายการสินค้าที่พร้อมขาย"
                  />
                  <StatCard
                    label="Cart"
                    value={cartItemsLabel}
                    helperText="จำนวนรายการที่ถูกเลือก"
                  />
                  <StatCard
                    label="Quantity"
                    value={totalQuantityLabel}
                    helperText="จำนวนชิ้นทั้งหมดในตะกร้า"
                  />
                </div>
              </div>

              <Card className="rounded-lg border border-black/8 bg-[#fafaf8] py-0 shadow-none">
                <CardContent className="flex h-full flex-col justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-black/50">Checkout Status</p>
                    <h2 className="mt-1 text-lg font-semibold tracking-normal text-[#1d1d1f]">
                      พร้อมขายและปิดบิลจากหน้าจอเดียว
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                      สต็อกในรายการสินค้าจะอัปเดตตามข้อมูลล่าสุดจากระบบก่อน checkout ทุกครั้ง
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-lg border border-black/10 bg-white px-4 py-3">
                      <p className="text-sm text-black/55">Grand Total</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {cartSummary.grandTotal.toFixed(2)}
                      </p>
                    </div>

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

        {success ? (
          <Alert className="border-green-200 bg-green-50 text-green-700">
            <CheckCircle2 className="size-4" />
            <AlertTitle>Checkout completed</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-normal text-[#1d1d1f]">
                Products
              </h2>

              {isLoading ? (
                <p className="text-sm text-black/60">Loading products...</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="rounded-lg border border-black/8 bg-[#fcfcfb] py-0 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <CardContent className="space-y-3 px-4 py-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-lg bg-black/5 text-sm text-black/50">
                        No image
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.stock <= 5 ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                            Low stock
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-black/60">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p>Price: {product.price}</p>
                      <p>Discount: {product.discount_price ?? 0}</p>
                      <p>VAT: {product.vat_rate}%</p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full"
                    >
                      <ShoppingCart />
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <aside>
            <Card className="h-fit rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardContent className="space-y-4 px-4 py-4">
                <h2 className="text-xl font-semibold tracking-normal text-[#1d1d1f]">
                  Cart
                </h2>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-black/60">No items in cart</p>
                ) : null}

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="space-y-2 rounded-lg border border-black/10 bg-black/[0.02] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-black/60">
                            Stock: {item.stock}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.product_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 />
                          Remove
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleDecreaseQuantity(item.product_id)}
                        >
                          <Minus />
                        </Button>

                        <span className="min-w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleIncreaseQuantity(item.product_id)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{cartSummary.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Discount</span>
                    <span>{cartSummary.totalDiscount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total VAT</span>
                    <span>{cartSummary.totalVat.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-semibold">
                    <span>Grand Total</span>
                    <span>{cartSummary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || isCheckingOut}
                  size="lg"
                  className="w-full"
                >
                  {isCheckingOut ? "Checking out..." : "Checkout"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receipt}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  )
}
