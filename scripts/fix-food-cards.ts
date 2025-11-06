import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Önce mevcut veriyi kontrol et
    const settings = await prisma.$queryRaw`
      SELECT "acceptedFoodCards" FROM "StoreSettings" WHERE id = 1
    ` as any[]

    if (settings.length === 0) {
      console.log('StoreSettings kaydı bulunamadı')
      return
    }

    const currentValue = settings[0].acceptedFoodCards
    console.log('Mevcut değer:', currentValue)
    console.log('Tip:', typeof currentValue)

    // Eğer TEXT[] formatında ise JSON'a çevir
    if (Array.isArray(currentValue) && typeof currentValue[0] === 'string') {
      console.log('TEXT[] formatında, JSON\'a çeviriliyor...')
      
      const jsonValue = currentValue.map((name: string) => ({
        name,
        imageUrl: null,
        isActive: true
      }))

      // Önce kolonu JSON tipine çevir (eğer TEXT[] ise)
      // Her komutu ayrı ayrı çalıştır
      
      // 1. Geçici kolon oluştur
      await prisma.$executeRawUnsafe(`ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "acceptedFoodCards_temp" JSON;`)
      
      // 2. TEXT[] verisini JSON'a çevir ve geçici kolona yaz
      await prisma.$executeRawUnsafe(`
        UPDATE "StoreSettings"
        SET "acceptedFoodCards_temp" = (
          SELECT json_agg(
            json_build_object(
              'name', value,
              'imageUrl', NULL,
              'isActive', true
            )
          )
          FROM unnest("acceptedFoodCards"::text[]) AS value
        )
        WHERE id = 1;
      `)
      
      // 3. Eski kolonu sil
      await prisma.$executeRawUnsafe(`ALTER TABLE "StoreSettings" DROP COLUMN IF EXISTS "acceptedFoodCards";`)
      
      // 4. Geçici kolonu asıl isme çevir
      await prisma.$executeRawUnsafe(`ALTER TABLE "StoreSettings" RENAME COLUMN "acceptedFoodCards_temp" TO "acceptedFoodCards";`)

      console.log('✅ Başarıyla JSON formatına çevrildi:', jsonValue)
    } else {
      console.log('✅ Zaten JSON formatında veya null')
    }
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

