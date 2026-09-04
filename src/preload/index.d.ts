import { ElectronAPI } from '@electron-toolkit/preload'

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

interface Api {
  getProducts: () => Promise<Product[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}