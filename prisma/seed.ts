import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Store Settings oluştur (tek bir kayıt, id=1)
  const storeSettings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      isOpen: true, // Varsayılan olarak açık
      deliveryStatus: 'normal', // Varsayılan teslimat durumu
    },
  })

  console.log('Mağaza ayarları oluşturuldu:', storeSettings.isOpen ? 'AÇIK ✅' : 'KAPALI ❌')
  console.log('Teslimat durumu:', storeSettings.deliveryStatus)
  console.log('---')

  // Admin kullanıcı oluştur
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@highwayburger.com' },
    update: {},
    create: {
      email: 'admin@highwayburger.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'admin',
    },
  })

  console.log('Admin kullanıcı oluşturuldu:', admin.email)
  console.log('Email: admin@highwayburger.com')
  console.log('Password: admin123')
  console.log('---')

  // Eğer zaten ürün varsa, örnek verileri ekleme (kullanıcı kendi verilerini kullanıyor)
  const productCount = await prisma.product.count()
  
  if (productCount > 0) {
    console.log(`⚠️  Database'de ${productCount} ürün var. Örnek veriler eklenmedi.`)
    console.log('   (Eğer örnek verileri tekrar eklemek istersen, önce tüm ürünleri sil)')
    return
  }

  console.log('📦 Database boş, örnek veriler ekleniyor...\n')

  // Kategorileri oluştur
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'burgers' },
      update: {},
      create: {
        name: 'Burgerler',
        slug: 'burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'toast' },
      update: {},
      create: {
        name: 'Tostlar',
        slug: 'toast',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sandwiches' },
      update: {},
      create: {
        name: 'Sıcak Sandviçler',
        slug: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'drinks' },
      update: {},
      create: {
        name: 'İçecekler',
        slug: 'drinks',
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'menus' },
      update: {},
      create: {
        name: 'Menüler',
        slug: 'menus',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400'
      },
    }),
  ])

  console.log('Kategoriler oluşturuldu:', categories.map(c => c.name))

  // Örnek ürünler oluştur
  const products = await Promise.all([
    // Burgerler
    prisma.product.upsert({
      where: { slug: 'klasik-burger' },
      update: {
        secondPrice: 55, // 180gr için
        extraText: '110/180gr',
      },
      create: {
        name: 'Klasik Burger',
        slug: 'klasik-burger',
        description: 'Taze et, marul, domates ve özel sos ile',
        price: 45,
        secondPrice: 55, // 180gr için
        extraText: '110/180gr',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        categoryId: categories[0].id // burgers
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cheese-burger' },
      update: {
        secondPrice: 65, // 180gr için
        extraText: '110/180gr',
      },
      create: {
        name: 'Cheese Burger',
        slug: 'cheese-burger',
        description: 'Çift peynirli nefis burger',
        price: 55,
        secondPrice: 65, // 180gr için
        extraText: '110/180gr',
        imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
        categoryId: categories[0].id // burgers
      },
    }),
    
    // Sandviçler
    prisma.product.upsert({
      where: { slug: 'klasik-sandvic' },
      update: {},
      create: {
        name: 'Klasik Sandviç',
        slug: 'klasik-sandvic',
        description: 'Tavuk, marul, domates ile',
        price: 35,
        secondPrice: 45, // +patates için
        extraText: '+ Patates',
        imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
        categoryId: categories[2].id // sandwiches
      },
    }),
    prisma.product.upsert({
      where: { slug: 'tavuk-sandvic' },
      update: {},
      create: {
        name: 'Tavuk Sandviç',
        slug: 'tavuk-sandvic',
        description: 'Izgara tavuk göğsü ile',
        price: 40,
        secondPrice: 50, // +patates için
        extraText: '+ Patates',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        categoryId: categories[2].id // sandwiches
      },
    }),

    // Tostlar
    prisma.product.upsert({
      where: { slug: 'klasik-tost' },
      update: {},
      create: {
        name: 'Klasik Tost',
        slug: 'klasik-tost',
        description: 'Peynir ve domates ile',
        price: 25,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        categoryId: categories[1].id // toast
      },
    }),

    // İçecekler
    prisma.product.upsert({
      where: { slug: 'kola' },
      update: {},
      create: {
        name: 'Kola',
        slug: 'kola',
        description: 'Soğuk kola',
        price: 15,
        imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        categoryId: categories[3].id // drinks
      },
    }),
  ])

  console.log('Ürünler oluşturuldu:', products.map(p => p.name))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })