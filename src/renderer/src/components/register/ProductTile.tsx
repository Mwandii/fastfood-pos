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

interface ProductTileProps {
  product: Product
  onSelect: (product: Product) => void
}

function ProductTile({ product, onSelect }: ProductTileProps) {
  function renderPrice(): string {
    if (product.pricing_type === 'fixed' && product.base_price !== null) {
      return `KSh ${product.base_price}`
    }
    if (product.pricing_type === 'variant' && product.variants.length > 0) {
      const lowestPrice = Math.min(...product.variants.map((v) => v.price))
      return `from KSh ${lowestPrice}`
    }
    return 'Tap to enter amount'
  }

  return (
    <button
      onClick={() => onSelect(product)}
      className="flex flex-col items-center justify-center h-28 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors p-3 text-center"
    >
      <span className="text-white font-semibold text-lg">{product.name}</span>
      <span className="text-gray-400 text-sm mt-1">{renderPrice()}</span>
    </button>
  )
}

export default ProductTile