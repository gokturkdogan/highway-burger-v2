# 🚀 Highway Burger - Kurulum Rehberi

Bu rehber projeyi sıfırdan başlatmanız için tüm adımları içerir.

## 📋 Ön Gereksinimler

Sisteminizde aşağıdakiler yüklü olmalıdır:

- **Node.js** 18 veya üzeri ([İndir](https://nodejs.org/))
- **PostgreSQL** ([İndir](https://www.postgresql.org/download/))
- **npm** veya **yarn** package manager

## 🔧 Adım Adım Kurulum

### 1. PostgreSQL Veritabanı Oluşturma

PostgreSQL'i başlattıktan sonra:

```bash
# PostgreSQL'e bağlan
psql postgres

# Yeni veritabanı oluştur
CREATE DATABASE burgerdb;

# Kullanıcı oluştur (opsiyonel)
CREATE USER burgeruser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE burgerdb TO burgeruser;

# Çıkış
\q
```

### 2. Bağımlılıkları Yükleme

```bash
cd highway-burger-v2
npm install
```

### 3. Environment Variables Ayarlama

Proje kök dizininde `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# PostgreSQL bağlantı URL'i
DATABASE_URL="postgresql://burgeruser:your_password@localhost:5432/burgerdb"

# NextAuth yapılandırması
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecretkey123456789"  # Değiştirin!

# Iyzico (Test/Sandbox)
IYZICO_API_KEY="sandbox-your_api_key"
IYZICO_SECRET_KEY="sandbox-your_secret_key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"

# Public URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**NEXTAUTH_SECRET Oluşturma:**
```bash
openssl rand -base64 32
```

### 4. Prisma Migrasyonu

Veritabanı tablolarını oluşturun:

```bash
npx prisma migrate dev --name init
```

Bu komut:
- `prisma/migrations` klasörü oluşturur
- Veritabanında tabloları oluşturur
- Prisma Client'ı generate eder

### 5. Seed Data Ekleme

Örnek ürün ve kullanıcıları yükleyin:

```bash
npx prisma db seed
```

Bu şunları ekler:
- Test kullanıcı (email: test@example.com, şifre: 123456)
- 3 kategori (Burgerler, İçecekler, Yan Ürünler)
- 13 ürün
- 2 kupon kodu (WELCOME10, SUMMER20)

### 6. Development Server'ı Başlatma

```bash
npm run dev
```

Tarayıcınızda açın: `http://localhost:3000`

## 🎯 Hızlı Test

1. **Anasayfa:** Tüm ürünleri göreceksiniz
2. **Giriş:** `test@example.com` / `123456`
3. **Sepete Ekle:** Bir ürüne tıklayın ve sepete ekleyin
4. **Kupon:** Sepette `WELCOME10` kuponunu deneyin
5. **Checkout:** Giriş yaptıktan sonra ödemeye geçebilirsiniz

## 🗄️ Prisma Studio (Veritabanı GUI)

Veritabanınızı görsel olarak yönetmek için:

```bash
npx prisma studio
```

Tarayıcıda açılır: `http://localhost:5555`

## 🔧 Sık Kullanılan Komutlar

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server başlat
npm start

# Linting
npm run lint

# Prisma Studio
npx prisma studio

# Prisma migration oluştur
npx prisma migrate dev --name migration_name

# Prisma schema push (development)
npx prisma db push

# Seed data ekle
npx prisma db seed
```

## 🐛 Sorun Giderme

### Prisma bağlantı hatası

```
Error: P1001: Can't reach database server
```

**Çözüm:**
- PostgreSQL'in çalıştığından emin olun
- `DATABASE_URL` doğru olduğundan emin olun
- Firewall ayarlarını kontrol edin

### Port 3000 zaten kullanımda

```bash
# Farklı bir port kullanın
npm run dev -- -p 3001
```

### Prisma Client hatası

```bash
# Prisma Client'ı yeniden generate edin
npx prisma generate
```

### Migration hatası

```bash
# Migration'ları sıfırlayın (DİKKAT: Tüm veri silinir!)
npx prisma migrate reset
```

## 🎨 Proje Yapısı

```
highway-burger-v2/
├── prisma/
│   ├── schema.prisma       # Veritabanı şeması
│   └── seed.ts             # Seed data
├── public/                 # Statik dosyalar
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── auth/          # Login/Register
│   │   ├── cart/          # Sepet
│   │   ├── checkout/      # Checkout
│   │   ├── products/      # Ürün detay
│   │   └── categories/    # Kategori
│   ├── components/        # React components
│   │   └── ui/            # shadcn/ui
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Production Deploy

### Vercel'e Deploy

1. GitHub repository oluşturun
2. Vercel'de projeyi import edin
3. Environment variables ekleyin
4. Deploy edin

### Neon PostgreSQL Kullanma

1. [Neon.tech](https://neon.tech)'e kaydolun
2. Yeni proje oluşturun
3. Connection string'i kopyalayın
4. `.env`'de `DATABASE_URL` güncelleyin
5. Migrate edin: `npx prisma migrate deploy`

## 📚 Ek Kaynaklar

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Prisma Dokümantasyonu](https://www.prisma.io/docs)
- [NextAuth.js Dokümantasyonu](https://next-auth.js.org/)
- [TailwindCSS Dokümantasyonu](https://tailwindcss.com/docs)
- [Iyzico API Dokümantasyonu](https://dev.iyzipay.com/)

## 💡 İpuçları

1. **Hot Reload:** Dosyaları kaydettiğinizde otomatik yenilenir
2. **Type Safety:** TypeScript hatalarına dikkat edin
3. **Console Logs:** `console.log` ile debug yapın
4. **Prisma Studio:** Veritabanını görsel kontrol edin
5. **React Query DevTools:** `@tanstack/react-query-devtools` ekleyebilirsiniz

## 📞 Destek

Sorun yaşarsanız:
1. Hata mesajlarını okuyun
2. Console log'larını kontrol edin
3. GitHub Issues açın
4. README.md'yi tekrar okuyun

Başarılar! 🎉

