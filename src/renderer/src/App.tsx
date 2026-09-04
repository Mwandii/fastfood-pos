import { useState } from 'react'
import { useProducts } from './lib/queries'
import { useCartStore } from './store/cartStore'
import MenuGrid from './components/register/MenuGrid'
import Cart from './components/register/Cart'
import VariantPicker from './components/register/VariantPicker'
import AmountKeypad from './components/register/AmountKeypad'

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

function App() {
  const { data: products, isLoading, isError } = useProducts()
  const addItem = useCartStore((state) => state.addItem)

  const [variantPickerProduct, setVariantPickerProduct] = useState<Product | null>(null)
  const [keypadProduct, setKeypadProduct] = useState<Product | null>(null)

  function handleSelectProduct(product: Product): void {
    if (product.pricing_type === 'fixed' && product.base_price !== null) {
      addItem({
        productId: product.id,
        variantId: null,
        pricingType: 'fixed',
        name: product.name,
        unitPrice: product.base_price,
        quantity: 1
      })
      return
    }

    if (product.pricing_type === 'variant') {
      setVariantPickerProduct(product)
      return
    }

    if (product.pricing_type === 'customer_named') {
      setKeypadProduct(product)
      return
    }
  }

  function handleSelectVariant(variant: ProductVariant): void {
    if (!variantPickerProduct) return

    addItem({
      productId: variantPickerProduct.id,
      variantId: variant.id,
      pricingType: 'variant',
      name: `${variantPickerProduct.name} — ${variant.label}`,
      unitPrice: variant.price,
      quantity: 1
    })

    setVariantPickerProduct(null)
  }

  function handleConfirmAmount(amount: number): void {
    if (!keypadProduct) return

    addItem({
      productId: keypadProduct.id,
      variantId: null,
      pricingType: 'customer_named',
      name: keypadProduct.name,
      unitPrice: amount,
      quantity: 1
    })

    setKeypadProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-6">FastFood POS</h1>

        {isLoading && <p className="text-white">Loading products...</p>}
        {isError && <p className="text-red-400">Failed to load products.</p>}

        {products && <MenuGrid products={products} onSelectProduct={handleSelectProduct} />}
      </div>

      <div className="w-80 p-4">
        <Cart />
      </div>

      {variantPickerProduct && (
        <VariantPicker
          product={variantPickerProduct}
          onSelect={handleSelectVariant}
          onClose={() => setVariantPickerProduct(null)}
        />
      )}

      {keypadProduct && (
        <AmountKeypad
          productName={keypadProduct.name}
          onConfirm={handleConfirmAmount}
          onClose={() => setKeypadProduct(null)}
        />
      )}
    </div>
  )
}

export default App