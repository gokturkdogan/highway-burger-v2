import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Kullanıcı oluştur
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash,
    },
  })

  console.log('Created user:', user.email)

  // Kategoriler oluştur
  const burgerCategory = await prisma.category.upsert({
    where: { slug: 'burgers' },
    update: {},
    create: {
      name: 'Burgerler',
      slug: 'burgers',
    },
  })

  const drinkCategory = await prisma.category.upsert({
    where: { slug: 'drinks' },
    update: {},
    create: {
      name: 'İçecekler',
      slug: 'drinks',
    },
  })

  const sideCategory = await prisma.category.upsert({
    where: { slug: 'sides' },
    update: {},
    create: {
      name: 'Yan Ürünler',
      slug: 'sides',
    },
  })

  console.log('Created categories')

  // Burgerler
  const burgers = [
    {
      name: 'Classic Burger',
      slug: 'classic-burger',
      description:
        'Sığır eti, marul, domates, soğan, turşu ve özel sosumuz ile hazırlanan klasik burgerimiz',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      categoryId: burgerCategory.id,
    },
    {
      name: 'Cheese Burger',
      slug: 'cheese-burger',
      description:
        'Klasik burgerimize cheddar peyniri eklenmiş hali. Peynir severler için ideal',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500',
      categoryId: burgerCategory.id,
    },
    {
      name: 'Bacon Burger',
      slug: 'bacon-burger',
      description: 'Çıtır bacon dilimleri ile zenginleştirilmiş lezzetli burgerimiz',
      price: 109.99,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
      categoryId: burgerCategory.id,
    },
    {
      name: 'Double Burger',
      slug: 'double-burger',
      description: 'İki kat et, iki kat lezzet! Büyük açlıklar için',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500',
      categoryId: burgerCategory.id,
    },
    {
      name: 'Chicken Burger',
      slug: 'chicken-burger',
      description: 'Çıtır tavuk göğsü ile hazırlanan hafif burgerimiz',
      price: 84.99,
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500',
      categoryId: burgerCategory.id,
    },
    {
      name: 'Veggie Burger',
      slug: 'veggie-burger',
      description: 'Vejeteryanlar için özel olarak hazırlanmış sebze köfteli burgerimiz',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500',
      categoryId: burgerCategory.id,
    },
  ]

  for (const burger of burgers) {
    await prisma.product.upsert({
      where: { slug: burger.slug },
      update: {},
      create: burger,
    })
  }

  console.log('Created burgers')

  // İçecekler
  const drinks = [
    {
      name: 'Kola',
      slug: 'cola',
      description: 'Soğuk kola (330ml)',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
      categoryId: drinkCategory.id,
    },
    {
      name: 'Fanta',
      slug: 'fanta',
      description: 'Portakal aromalı soğuk içecek (330ml)',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500',
      categoryId: drinkCategory.id,
    },
    {
      name: 'Ayran',
      slug: 'ayran',
      description: 'Ev yapımı taze ayran (250ml)',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500',
      categoryId: drinkCategory.id,
    },
    {
      name: 'Su',
      slug: 'water',
      description: 'İçme suyu (500ml)',
      price: 5.99,
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
      categoryId: drinkCategory.id,
    },
  ]

  for (const drink of drinks) {
    await prisma.product.upsert({
      where: { slug: drink.slug },
      update: {},
      create: drink,
    })
  }

  console.log('Created drinks')

  // Yan ürünler
  const sides = [
    {
      name: 'Patates Kızartması',
      slug: 'french-fries',
      description: 'Çıtır çıtır altın sarısı patates kızartması',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500',
      categoryId: sideCategory.id,
    },
    {
      name: 'Soğan Halkası',
      slug: 'onion-rings',
      description: 'Çıtır paneli soğan halkaları',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500',
      categoryId: sideCategory.id,
    },
    {
      name: 'Chicken Nuggets',
      slug: 'chicken-nuggets',
      description: 'Mini tavuk parçaları (8 adet)',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500',
      categoryId: sideCategory.id,
    },
  ]

  for (const side of sides) {
    await prisma.product.upsert({
      where: { slug: side.slug },
      update: {},
      create: side,
    })
  }

  console.log('Created sides')

  // Kupon kodları
  const expiryDate = new Date()
  expiryDate.setMonth(expiryDate.getMonth() + 6)

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountPercent: 10,
      isActive: true,
      expiresAt: expiryDate,
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'SUMMER20' },
    update: {},
    create: {
      code: 'SUMMER20',
      discountPercent: 20,
      isActive: true,
      expiresAt: expiryDate,
    },
  })

  console.log('Created coupons')
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

