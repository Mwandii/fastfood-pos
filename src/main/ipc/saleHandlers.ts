import { ipcMain } from 'electron'
import { db } from '../db'

interface CartItemInput {
  productId: number
  variantId: number | null
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

interface CreateSaleInput {
  items: CartItemInput[]
  paymentMethod: 'cash' | 'mpesa'
}

export function registerSaleHandlers(): void {
  ipcMain.handle('sales:create', (_event, input: CreateSaleInput) => {
    const total = input.items.reduce((sum, i) => sum + i.lineTotal, 0)

    const insertSale = db.prepare(`
      INSERT INTO sales (status, payment_method, total_amount, paid_at)
      VALUES ('paid', @payment_method, @total_amount, datetime('now'))
    `)

    const insertSaleItem = db.prepare(`
      INSERT INTO sale_items
        (sale_id, product_id, variant_id, product_name_snapshot, quantity, unit_price, line_total)
      VALUES
        (@sale_id, @product_id, @variant_id, @product_name_snapshot, @quantity, @unit_price, @line_total)
    `)

    const decrementStock = db.prepare(`
      UPDATE product_variants SET stock_qty = stock_qty - @qty WHERE id = @variant_id
    `)

    const logStockAdjustment = db.prepare(`
      INSERT INTO stock_adjustments (variant_id, change_qty, reason, sale_id)
      VALUES (@variant_id, @change_qty, 'sale', @sale_id)
    `)

    const createSale = db.transaction(() => {
      const saleId = insertSale.run({
        payment_method: input.paymentMethod,
        total_amount: total
      }).lastInsertRowid as number

      for (const item of input.items) {
        insertSaleItem.run({
          sale_id: saleId,
          product_id: item.productId,
          variant_id: item.variantId,
          product_name_snapshot: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal
        })

        if (item.variantId !== null) {
          decrementStock.run({ qty: item.quantity, variant_id: item.variantId })
          logStockAdjustment.run({
            variant_id: item.variantId,
            change_qty: -item.quantity,
            sale_id: saleId
          })
        }
      }

      return saleId
    })

    const saleId = createSale()

    return { saleId, total }
  })
}