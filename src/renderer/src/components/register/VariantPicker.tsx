interface ProductVariant {
  id: number
  product_id: number
  label: string
  price: number
  barcode: string | null
  stock_qty: number
  is_active: number
}

interface Product {
  id: number
  name: string
  category: string
  pricing_type: 'fixed' | 'variant' | 'customer_named'
  base_price: number | null
  is_active: number
  track_inventory: number
  variants: ProductVariant[]
}

interface VariantPickerProps {
  product: Product
  onSelect: (variant: ProductVariant) => void
  onClose: () => void
}

function VariantPicker({ product, onSelect, onClose }: VariantPickerProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold text-lg mb-4">{product.name}</h2>

        <div className="space-y-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              <span>{variant.label}</span>
              <span className="text-gray-300">KSh {variant.price}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default VariantPicker