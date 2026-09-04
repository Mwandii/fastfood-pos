import { useState } from 'react'
import type { CartItem } from '../../store/cartStore'

interface CheckoutPanelProps {
  items: CartItem[]
  total: number
  onConfirm: (paymentMethod: 'cash' | 'mpesa') => void
  onClose: () => void
  isProcessing: boolean
  errorMessage: string | null
}

function CheckoutPanel({
  items,
  total,
  onConfirm,
  onClose,
  isProcessing,
  errorMessage
}: CheckoutPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | null>(null)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-white font-semibold text-lg mb-4">Checkout</h2>

        <div className="bg-gray-900 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto space-y-1">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {item.name} × {item.quantity}
              </span>
              <span className="text-white">KSh {item.lineTotal}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-white font-bold text-xl mb-4">
          <span>Total</span>
          <span>KSh {total}</span>
        </div>

        {errorMessage && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        )}

        {!paymentMethod && (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm mb-2">Select payment method</p>
            <button
              onClick={() => setPaymentMethod('cash')}
              className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod('mpesa')}
              className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
            >
              M-Pesa
            </button>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              Collect KSh {total} cash from the customer, then confirm.
            </p>
            <button
              onClick={() => onConfirm('cash')}
              disabled={isProcessing}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-semibold"
            >
              {isProcessing ? 'Processing...' : 'Confirm Paid'}
            </button>
            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full py-2 text-gray-400 text-sm"
            >
              Back
            </button>
          </div>
        )}

        {paymentMethod === 'mpesa' && (
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              Ask the customer to pay KSh {total} via M-Pesa to your till number. Check your
              phone for confirmation, then confirm below.
            </p>
            <button
              onClick={() => onConfirm('mpesa')}
              disabled={isProcessing}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-semibold"
            >
              {isProcessing ? 'Processing...' : 'Confirm Paid'}
            </button>
            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full py-2 text-gray-400 text-sm"
            >
              Back
            </button>
          </div>
        )}

        {!paymentMethod && (
          <button onClick={onClose} className="mt-3 w-full py-2 text-gray-400 text-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default CheckoutPanel