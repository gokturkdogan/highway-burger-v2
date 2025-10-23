import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Admin kullanıcı bilgileri
    const adminData = {
      name: 'Admin',
      email: 'admin@highwayburger.com.tr',
      password: 'admin123', // Güçlü şifre önerilir
      role: 'admin' as const
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(adminData.password, 12)

    // Kullanıcıyı oluştur
    const adminUser = await prisma.user.upsert({
      where: { email: adminData.email },
      update: {
        name: adminData.name,
        passwordHash: hashedPassword,
        role: adminData.role
      },
      create: {
        name: adminData.name,
        email: adminData.email,
        passwordHash: hashedPassword,
        role: adminData.role
      }
    })

    console.log('✅ Admin kullanıcı oluşturuldu/güncellendi:')
    console.log('📧 Email:', adminUser.email)
    console.log('👤 İsim:', adminUser.name)
    console.log('🔑 Şifre:', adminData.password)
    console.log('👑 Rol:', adminUser.role)
    console.log('🆔 ID:', adminUser.id)
    
    console.log('\n🔐 Giriş bilgileri:')
    console.log('Email: admin@highwayburger.com.tr')
    console.log('Şifre: admin123')
    console.log('\n⚠️  Güvenlik için şifreyi değiştirmeyi unutmayın!')

  } catch (error) {
    console.error('❌ Admin kullanıcı oluşturulurken hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
