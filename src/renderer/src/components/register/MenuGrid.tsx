import ProductTile from './ProductTile'

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

interface MenuGridProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
}

function MenuGrid({ products, onSelectProduct }: MenuGridProps) {
  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-2">{category}</h2>
          <div className="grid grid-cols-4 gap-3">
            {products
              .filter((p) => p.category === category)
              .map((product) => (
                <ProductTile key={product.id} product={product} onSelect={onSelectProduct} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenuGrid