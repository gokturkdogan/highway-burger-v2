import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'test@test.com'
  const password = '123456'
  const name = 'Test User'

  // Şifreyi hash'le
  const passwordHash = await bcrypt.hash(password, 10)

  // Kullanıcıyı oluştur
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
    },
    create: {
      email,
      passwordHash,
      name,
    },
  })

  console.log('Test kullanıcısı oluşturuldu:')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('User ID:', user.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

