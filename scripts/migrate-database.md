# 🔄 Database Migration Guide - Neon'dan Neon'a

## Yeni Neon Database'e Taşıma Adımları

### 1️⃣ Yeni Neon Database Oluştur
1. [Neon Console](https://console.neon.tech) → New Project
2. Database connection string'i kopyala
3. `.env` dosyasında geçici olarak kaydet: `NEW_DATABASE_URL=postgresql://...`

---

### 2️⃣ Eski Database'den Verileri Dışa Aktar

```bash
# PostgreSQL dump oluştur (tüm veri + schema)
pg_dump "eski-database-url" > backup.sql

# Sadece veri (INSERT statements)
pg_dump "eski-database-url" --data-only > data-backup.sql

# Sadece schema (CREATE TABLE statements)
pg_dump "eski-database-url" --schema-only > schema-backup.sql
```

**Not:** Neon free plan'de `pg_dump` doğrudan çalışmayabilir. Alternatif:

---

### 3️⃣ Yeni Database'e Schema'yı Kur

```bash
# .env dosyasında DATABASE_URL'i yeni database'e çevir
# Sonra:

npx prisma migrate deploy
# veya
npx prisma db push
```

Bu, mevcut migration'ları yeni database'e uygular.

---

### 4️⃣ Verileri Taşı

#### **Yöntem A: Prisma Studio ile Manuel (Küçük Veri)**
1. Eski database → Prisma Studio aç
2. Her tablodan verileri kopyala
3. Yeni database'e yapıştır

#### **Yöntem B: SQL Script ile**
```bash
# data-backup.sql dosyasını yeni database'e aktar
psql "yeni-database-url" < data-backup.sql
```

#### **Yöntem C: Custom Migration Script** (Önerilen)
```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client'

const oldDB = new PrismaClient({
  datasources: { db: { url: process.env.OLD_DATABASE_URL } }
})

const newDB = new PrismaClient({
  datasources: { db: { url: process.env.NEW_DATABASE_URL } }
})

async function migrateData() {
  console.log('🔄 Veri taşınıyor...\n')

  // 1. Users
  const users = await oldDB.user.findMany()
  for (const user of users) {
    await newDB.user.create({ data: user })
  }
  console.log(`✅ ${users.length} kullanıcı taşındı`)

  // 2. Categories
  const categories = await oldDB.category.findMany()
  for (const cat of categories) {
    await newDB.category.create({ data: cat })
  }
  console.log(`✅ ${categories.length} kategori taşındı`)

  // 3. Products
  const products = await oldDB.product.findMany()
  for (const product of products) {
    await newDB.product.create({ data: product })
  }
  console.log(`✅ ${products.length} ürün taşındı`)

  // 4. Orders
  const orders = await oldDB.order.findMany({ include: { items: true } })
  for (const order of orders) {
    const { items, ...orderData } = order
    const newOrder = await newDB.order.create({ data: orderData })
    
    // Order items
    for (const item of items) {
      const { id, ...itemData } = item
      await newDB.orderItem.create({
        data: { ...itemData, orderId: newOrder.id }
      })
    }
  }
  console.log(`✅ ${orders.length} sipariş taşındı`)

  // 5. Addresses
  const addresses = await oldDB.address.findMany()
  for (const addr of addresses) {
    await newDB.address.create({ data: addr })
  }
  console.log(`✅ ${addresses.length} adres taşındı`)

  // 6. Store Settings
  const settings = await oldDB.storeSettings.findUnique({ where: { id: 1 } })
  if (settings) {
    await newDB.storeSettings.create({ data: settings })
    console.log(`✅ Mağaza ayarları taşındı`)
  }

  console.log('\n🎉 Tüm veriler başarıyla taşındı!')
}

migrateData()
  .catch(console.error)
  .finally(async () => {
    await oldDB.$disconnect()
    await newDB.$disconnect()
  })
```

Çalıştırma:
```bash
OLD_DATABASE_URL="eski-url" NEW_DATABASE_URL="yeni-url" npx tsx scripts/migrate-data.ts
```

---

### 5️⃣ Test Et

```bash
# Yeni database'i kullan
DATABASE_URL="yeni-url" npm run dev

# Kontroller:
# - Kullanıcılar login olabiliyor mu?
# - Ürünler görünüyor mu?
# - Siparişler doğru mu?
# - Admin paneli çalışıyor mu?
```

---

### 6️⃣ Production'a Al

```bash
# .env dosyasında DATABASE_URL'i güncelle
DATABASE_URL="yeni-database-url"

# Uygulamayı restart et
```

---

## ⚠️ Önemli Notlar

1. **Migration öncesi backup al:**
   - Neon Console → Settings → Backups
   - Veya `pg_dump` ile manuel backup

2. **Auto-increment ID'ler:**
   - PostgreSQL sequence'leri resetlenmeli
   ```sql
   SELECT setval('user_id_seq', (SELECT MAX(id) FROM "User"));
   SELECT setval('product_id_seq', (SELECT MAX(id) FROM "Product"));
   -- Tüm tablolar için tekrarla
   ```

3. **Foreign Key Constraints:**
   - İlişkili verileri doğru sırada taşı:
     1. Users
     2. Categories
     3. Products
     4. Addresses
     5. Orders
     6. OrderItems

4. **Cloudinary Görselleri:**
   - Görseller Cloudinary'de, URL'ler database'de
   - URL'ler taşınınca görseller de taşınmış olur

---

## 🚀 Hızlı Özet

```bash
# 1. Yeni Neon database oluştur
# 2. Schema'yı kur
npx prisma migrate deploy

# 3. Veri taşıma script'i oluştur ve çalıştır
npx tsx scripts/migrate-data.ts

# 4. Test et
npm run dev

# 5. .env'i güncelle ve production'a al
```

---

## 💡 Alternatif: Neon Branching

Neon'un kendi branch özelliğini kullanabilirsin:
- Mevcut database'den branch oluştur
- Branch'i yeni project'e taşı
- Daha hızlı ve güvenli!

[Neon Branching Docs](https://neon.tech/docs/guides/branching)

