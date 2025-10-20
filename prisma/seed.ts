import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })