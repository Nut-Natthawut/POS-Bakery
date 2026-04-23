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
  
  const handlePrint = () => {
    window.print()
  }

  if (!isOpen || !receipt) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 print:static print:block print:bg-white">
      <div className="print-receipt w-full max-w-md rounded-md bg-white p-6 shadow-lg print:max-w-[280px] print:rounded-none print:p-3 print:shadow-none">
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div>
            <p className="text-sm text-black/60">Digital Receipt</p>
            <h2 className="text-2xl font-semibold">Receipt</h2>
            <p className="mt-1 text-sm text-black/60">
              Order ID: {receipt.order_id}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-md border px-4 py-2 text-sm hover:bg-black/5"
            >
              Print
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm hover:bg-black/5"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mb-4 hidden text-center print:block">
          <p className="text-sm font-medium tracking-wide text-black/60">
            POS Bakery
          </p>
          <h2 className="text-xl font-semibold">Receipt</h2>
          <p className="mt-1 text-xs text-black/60">
            Order ID: {receipt.order_id}
          </p>
        </div>

        <div className="mt-6 space-y-3 print:mt-0">
          <div className="border-b border-dashed border-black/25 pb-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-black/60">Seller</span>
              <span className="font-medium">{receipt.seller_name}</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-black/60">Order ID</span>
              <span className="break-all text-right text-xs">{receipt.order_id}</span>
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black/65">
              Items
            </h3>

            <div className="space-y-2 border-b border-dashed border-black/25 pb-3">
              {receipt.items.map((item) => (
                <div key={`${item.product_id}-${item.quantity}`} className="text-sm">
                  <p className="font-medium">{item.product_name}</p>
                  <div className="mt-1 flex justify-between gap-3 text-black/65">
                    <span>Qty {item.quantity}</span>
                    <span>{item.price_at_sale.toFixed(2)}</span>
                  </div>
                  <div className="mt-1 flex justify-between gap-3 text-black/55">
                    <span>VAT </span>
                    <span>{item.vat_at_sale.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2 border-b border-dashed border-black/25 pb-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{receipt.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>{receipt.total_discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT</span>
              <span>{receipt.total_vat.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-1 text-base font-semibold">
              <span>Grand Total</span>
              <span>{receipt.grand_total.toFixed(2)} THB</span>
            </div>
          </section>

          <section className="space-y-2 text-center">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-black/65">
                PromptPay QR
              </h3>
              <p className="mt-1 text-xs text-black/55">
                สแกนเพื่อชำระเงินตามยอดบิล
              </p>
            </div>

            <div className="flex justify-center">
              <QRCodeSVG
                value={receipt.promptpay_payload}
                size={120}
                includeMargin
              />
            </div>

            <p className="text-lg font-semibold">
              {receipt.grand_total.toFixed(2)} THB
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
