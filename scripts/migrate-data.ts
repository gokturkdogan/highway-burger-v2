import { PrismaClient, Prisma } from '@prisma/client'

// Eski ve yeni database connection'ları
const oldDB = new PrismaClient({
  datasources: { 
    db: { url: process.env.OLD_DATABASE_URL } 
  }
})

const newDB = new PrismaClient({
  datasources: { 
    db: { url: process.env.NEW_DATABASE_URL } 
  }
})

async function migrateData() {
  console.log('🔄 Database Migration Başlatılıyor...\n')
  console.log('📍 Eski DB:', process.env.OLD_DATABASE_URL?.substring(0, 50) + '...')
  console.log('📍 Yeni DB:', process.env.NEW_DATABASE_URL?.substring(0, 50) + '...')
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // 1. Store Settings
    console.log('⚙️  Mağaza ayarları taşınıyor...')
    const settings = await oldDB.storeSettings.findUnique({ where: { id: 1 } })
    if (settings) {
      const settingsData = {
        ...settings,
        acceptedFoodCards: settings.acceptedFoodCards ? (settings.acceptedFoodCards as Prisma.InputJsonValue) : undefined
      }
      await newDB.storeSettings.upsert({
        where: { id: 1 },
        update: settingsData,
        create: settingsData
      })
      console.log(`   ✅ Mağaza ayarları taşındı\n`)
    }

    // 2. Users
    console.log('👤 Kullanıcılar taşınıyor...')
    const users = await oldDB.user.findMany()
    for (const user of users) {
      await newDB.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      })
    }
    console.log(`   ✅ ${users.length} kullanıcı taşındı\n`)

    // 3. Categories
    console.log('📁 Kategoriler taşınıyor...')
    const categories = await oldDB.category.findMany()
    for (const cat of categories) {
      await newDB.category.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat
      })
    }
    console.log(`   ✅ ${categories.length} kategori taşındı\n`)

    // 4. Products
    console.log('🍔 Ürünler taşınıyor...')
    const products = await oldDB.product.findMany()
    for (const product of products) {
      await newDB.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      })
    }
    console.log(`   ✅ ${products.length} ürün taşındı\n`)

    // 5. Coupons
    console.log('🎫 Kuponlar taşınıyor...')
    const coupons = await oldDB.coupon.findMany()
    for (const coupon of coupons) {
      await newDB.coupon.upsert({
        where: { id: coupon.id },
        update: coupon,
        create: coupon
      })
    }
    console.log(`   ✅ ${coupons.length} kupon taşındı\n`)

    // 6. Addresses
    console.log('📍 Adresler taşınıyor...')
    const addresses = await oldDB.address.findMany()
    for (const addr of addresses) {
      await newDB.address.upsert({
        where: { id: addr.id },
        update: addr,
        create: addr
      })
    }
    console.log(`   ✅ ${addresses.length} adres taşındı\n`)

    // 7. Orders + OrderItems
    console.log('📦 Siparişler taşınıyor...')
    const orders = await oldDB.order.findMany({
      include: { items: true }
    })
    
    for (const order of orders) {
      const { items, ...orderData } = order
      
      // Order'ı oluştur/güncelle
      await newDB.order.upsert({
        where: { id: order.id },
        update: orderData,
        create: orderData
      })
      
      // Order items'ları oluştur/güncelle
      for (const item of items) {
        await newDB.orderItem.upsert({
          where: { id: item.id },
          update: item,
          create: item
        })
      }
    }
    console.log(`   ✅ ${orders.length} sipariş taşındı\n`)

    // 8. Sequence'leri resetle (auto-increment ID'ler için)
    console.log('🔢 Sequence\'ler ayarlanıyor...')
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "User";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Category"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "Category";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "Product";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Order"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "Order";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"OrderItem"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "OrderItem";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Address"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "Address";
    `)
    await newDB.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Coupon"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "Coupon";
    `)
    console.log(`   ✅ Sequence'ler ayarlandı\n`)

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🎉 Migration Tamamlandı!\n')
    console.log('📊 Özet:')
    console.log(`   • ${users.length} Kullanıcı`)
    console.log(`   • ${categories.length} Kategori`)
    console.log(`   • ${products.length} Ürün`)
    console.log(`   • ${orders.length} Sipariş`)
    console.log(`   • ${addresses.length} Adres`)
    console.log(`   • ${coupons.length} Kupon`)
    console.log('\n✨ Yeni database kullanıma hazır!')

  } catch (error) {
    console.error('\n❌ Migration Hatası:', error)
    throw error
  }
}

// Çalıştır
migrateData()
  .catch((error) => {
    console.error('Migration başarısız:', error)
    process.exit(1)
  })
  .finally(async () => {
    await oldDB.$disconnect()
    await newDB.$disconnect()
  })

