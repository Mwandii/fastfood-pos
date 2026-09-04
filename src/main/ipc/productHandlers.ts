import { ipcMain } from 'electron'
import { db } from '../db'

interface ProductRow {
  id: number
  name: string
  category: string
  pricing_type: string
  base_price: number | null
  is_active: number
  track_inventory: number
}

interface VariantRow {
  id: number
  product_id: number
  label: string
  price: number
  barcode: string | null
  stock_qty: number
  is_active: number
}

export function registerProductHandlers(): void {
  ipcMain.handle('products:getAll', () => {
    const products = db
      .prepare('SELECT * FROM products WHERE is_active = 1')
      .all() as ProductRow[]

    const variants = db
      .prepare('SELECT * FROM product_variants WHERE is_active = 1')
      .all() as VariantRow[]

    return products.map((product) => ({
      ...product,
      variants: variants.filter((v) => v.product_id === product.id)
    }))
  })
}