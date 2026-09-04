import { db } from './index'

export function seedDatabase(): void {
  const existing = db.prepare('SELECT COUNT(*) as count FROM products').get() as {
    count: number
  }

  if (existing.count > 0) {
    return // already seeded, don't duplicate
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, pricing_type, base_price, track_inventory)
    VALUES (@name, @category, @pricing_type, @base_price, @track_inventory)
  `)

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, label, price, stock_qty)
    VALUES (@product_id, @label, @price, @stock_qty)
  `)

  const seedAll = db.transaction(() => {
    // Fixed-price items
    insertProduct.run({
      name: 'Smokies',
      category: 'snacks',
      pricing_type: 'fixed',
      base_price: 30,
      track_inventory: 0
    })
    insertProduct.run({
      name: 'Sausage',
      category: 'snacks',
      pricing_type: 'fixed',
      base_price: 30,
      track_inventory: 0
    })
    insertProduct.run({
      name: 'Samosa',
      category: 'snacks',
      pricing_type: 'fixed',
      base_price: 20,
      track_inventory: 0
    })
    insertProduct.run({
      name: 'Tea',
      category: 'drinks',
      pricing_type: 'fixed',
      base_price: 20,
      track_inventory: 0
    })
    insertProduct.run({
      name: 'Chapati',
      category: 'snacks',
      pricing_type: 'fixed',
      base_price: 20,
      track_inventory: 0
    })

    // Customer-named-amount items
    insertProduct.run({
      name: 'Fries',
      category: 'snacks',
      pricing_type: 'customer_named',
      base_price: null,
      track_inventory: 0
    })
    insertProduct.run({
      name: 'Bhajia',
      category: 'snacks',
      pricing_type: 'customer_named',
      base_price: null,
      track_inventory: 0
    })

    // Variant items — Soda
    const sodaId = insertProduct.run({
      name: 'Soda',
      category: 'drinks',
      pricing_type: 'variant',
      base_price: null,
      track_inventory: 1
    }).lastInsertRowid as number

    insertVariant.run({ product_id: sodaId, label: '300ml Plastic', price: 60, stock_qty: 0 })
    insertVariant.run({ product_id: sodaId, label: '500ml Plastic', price: 80, stock_qty: 0 })
    insertVariant.run({ product_id: sodaId, label: '300ml Glass', price: 50, stock_qty: 0 })
    insertVariant.run({ product_id: sodaId, label: '500ml Glass', price: 70, stock_qty: 0 })

    // Variant items — Water
    const waterId = insertProduct.run({
      name: 'Water',
      category: 'drinks',
      pricing_type: 'variant',
      base_price: null,
      track_inventory: 1
    }).lastInsertRowid as number

    insertVariant.run({ product_id: waterId, label: '500ml', price: 50, stock_qty: 0 })
    insertVariant.run({ product_id: waterId, label: '1L', price: 100, stock_qty: 0 })
  })

  seedAll()
}