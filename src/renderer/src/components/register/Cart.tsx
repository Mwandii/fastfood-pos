import { useCartStore } from '../../store/cartStore'

function Cart() {
  const items = useCartStore((state) => state.items)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotal = useCartStore((state) => state.getTotal)

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">Current Sale</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 && <p className="text-gray-500 text-sm">Cart is empty</p>}

        {items.map((item) => (
          <div key={item.cartItemId} className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{item.name}</p>
              <p className="text-gray-400 text-xs">KSh {item.unitPrice} each</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => decrementItem(item.cartItemId)}
                className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
              >
                −
              </button>
              <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => incrementItem(item.cartItemId)}
                className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
              >
                +
              </button>
            </div>

            <p className="text-white text-sm w-16 text-right">KSh {item.lineTotal}</p>

            <button
              onClick={() => removeItem(item.cartItemId)}
              className="text-gray-500 hover:text-red-400 text-sm px-1"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-between text-white font-bold text-lg mb-3">
          <span>Total</span>
          <span>KSh {getTotal()}</span>
        </div>
        <button
          disabled={items.length === 0}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart