import { QRCodeSVG } from "qrcode.react"
import type { ReceiptData } from "../types/receipt"

type ReceiptModalProps = {
  isOpen: boolean
  receipt: ReceiptData | null
  onClose: () => void
}

export const ReceiptModal = ({
  isOpen,
  receipt,
  onClose,
}: ReceiptModalProps) => {
  if (!isOpen || !receipt) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-md bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-black/60">Digital Receipt</p>
            <h2 className="text-2xl font-semibold">Receipt</h2>
            <p className="mt-1 text-sm text-black/60">
              Order ID: {receipt.order_id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-4">
            <div className="rounded-md border p-4">
              <p className="text-sm text-black/60">Seller</p>
              <p className="font-medium">{receipt.seller_name}</p>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="font-semibold">Items</h3>

              <div className="mt-4 space-y-3">
                {receipt.items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.quantity}`}
                    className="rounded-md border p-3"
                  >
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-black/60">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-black/60">
                      Price at sale: {item.price_at_sale.toFixed(2)}
                    </p>
                    <p className="text-sm text-black/60">
                      VAT at sale: {item.vat_at_sale.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="font-semibold">Summary</h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{receipt.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span>{receipt.total_discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total VAT</span>
                  <span>{receipt.total_vat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-semibold">
                  <span>Grand Total</span>
                  <span>{receipt.grand_total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 text-center">
              <h3 className="font-semibold">PromptPay QR</h3>
              <p className="mt-1 text-sm text-black/60">
                สแกนเพื่อชำระเงินตามยอดบิล
              </p>

              <div className="mt-4 flex justify-center">
                <QRCodeSVG
                  value={receipt.promptpay_payload}
                  size={220}
                  includeMargin
                />
              </div>

              <p className="mt-4 text-lg font-semibold">
                {receipt.grand_total.toFixed(2)} THB
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
