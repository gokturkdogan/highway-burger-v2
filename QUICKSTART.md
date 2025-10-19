# ⚡ Hızlı Başlangıç - 5 Dakikada Başlat

Highway Burger projesini hızlıca çalıştırmak için bu rehberi takip edin.

## 🎯 Hızlı Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyasını oluştur
# Aşağıdaki içeriği .env dosyasına kopyala

# 3. PostgreSQL veritabanı oluştur
createdb burgerdb

# 4. Veritabanı migrasyonu
npx prisma migrate dev --name init

# 5. Örnek verileri yükle
npx prisma db seed

# 6. Başlat!
npm run dev
```

## 📝 Minimal .env İçeriği

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/burgerdb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecret12345"
IYZICO_API_KEY="sandbox-test"
IYZICO_SECRET_KEY="sandbox-test"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## ✅ Test Bilgileri

**Kullanıcı:**
- Email: `test@example.com`
- Şifre: `123456`

**Kupon Kodları:**
- `WELCOME10` - %10 indirim
- `SUMMER20` - %20 indirim

## 🎨 Özellikler

- ✅ Kategori bazlı ürün listeleme
- ✅ Sepet yönetimi
- ✅ Kupon sistemi
- ✅ Kullanıcı kayıt/giriş
- ✅ Iyzico ödeme entegrasyonu
- ✅ Responsive tasarım

## 🚀 Projeyi Keşfet

1. **Anasayfa:** http://localhost:3000
2. **Burgerler:** Kategori filtreleri
3. **Sepet:** Ürün ekle/çıkar
4. **Giriş:** test@example.com / 123456
5. **Kupon:** Sepette WELCOME10 yaz
6. **Checkout:** Ödeme sayfası (test mode)

## 📚 Daha Fazla Bilgi

- Detaylı kurulum: `SETUP.md`
- Iyzico detayları: `IYZICO_SETUP.md`
- Proje dokümantasyonu: `README.md`

## 🆘 Sorun mu Yaşıyorsun?

**PostgreSQL bağlantı hatası?**
```bash
# PostgreSQL çalışıyor mu kontrol et
pg_isready
```

**Port 3000 zaten kullanımda?**
```bash
npm run dev -- -p 3001
```

**Prisma hatası?**
```bash
npx prisma generate
npx prisma db push
```

---

İyi kodlamalar! 🍔

