# 🍔 Highway Burger - Burger Shop E-Commerce

Modern, hızlı ve kullanıcı dostu bir burger dükkanı e-ticaret sitesi. Next.js 15, TailwindCSS, Prisma ve Iyzico entegrasyonu ile geliştirilmiştir.

## ✨ Özellikler

- 🛍️ **E-Ticaret Özellikleri**
  - Kategori bazlı ürün listeleme
  - Ürün detay sayfaları
  - Sepet yönetimi (Zustand)
  - Kupon kodu sistemi
  - Güvenli ödeme (Iyzico)

- 👤 **Kullanıcı Yönetimi**
  - Kayıt olma / Giriş yapma (NextAuth.js)
  - Güvenli şifre hash'leme
  - Session yönetimi

- 🎨 **Modern UI/UX**
  - shadcn/ui component library
  - TailwindCSS ile responsive tasarım
  - Marka rengi: #FFB703
  - Inter font family

- 🚀 **Performans & Teknoloji**
  - Next.js 15 App Router
  - React Query (veri caching)
  - PostgreSQL + Prisma ORM
  - Type-safe TypeScript

## 🏗️ Teknoloji Yığını

### Frontend
- Next.js 15 (App Router)
- React 18
- TailwindCSS
- shadcn/ui
- Zustand (state management)
- React Query
- Lucide Icons

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js
- bcryptjs

### Ödeme
- Iyzico Payment Gateway

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment variables ayarlayın:**

`.env` dosyası oluşturun ve aşağıdaki değişkenleri ayarlayın:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/burgerdb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key_here"
IYZICO_API_KEY="your_iyzico_api_key"
IYZICO_SECRET_KEY="your_iyzico_secret"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

3. **Veritabanını oluşturun:**
```bash
npx prisma migrate dev --name init
```

4. **Seed data ekleyin:**
```bash
npx prisma db seed
```

5. **Development server'ı başlatın:**
```bash
npm run dev
```

Site `http://localhost:3000` adresinde açılacaktır.

## 📝 Seed Data

Seed script ile örnek veriler eklenir:

- **Test Kullanıcı:**
  - Email: `test@example.com`
  - Şifre: `123456`

- **Kategoriler:** Burgerler, İçecekler, Yan Ürünler
- **Ürünler:** 13 farklı ürün
- **Kupon Kodları:**
  - `WELCOME10` - %10 indirim
  - `SUMMER20` - %20 indirim

## 🗂️ Proje Yapısı

```
src/
├── app/
│   ├── (root)/page.tsx          # Anasayfa
│   ├── products/[slug]/         # Ürün detay
│   ├── categories/[slug]/       # Kategori listesi
│   ├── cart/                    # Sepet
│   ├── checkout/                # Checkout
│   ├── auth/                    # Login/Register
│   └── api/                     # API Routes
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CategoryList.tsx
│   └── CartSummary.tsx
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # NextAuth config
│   ├── iyzico.ts                # Iyzico integration
│   └── utils.ts                 # Utility functions
└── hooks/
    └── useCart.ts               # Zustand cart store
```

## 🔧 Prisma Komutları

```bash
# Migration oluştur
npx prisma migrate dev --name migration_name

# Prisma Studio'yu aç
npx prisma studio

# Schema'yı push et
npx prisma db push

# Seed data ekle
npx prisma db seed
```

## 🚀 Deployment

### Vercel'e Deploy

1. GitHub'a push edin
2. Vercel'de projeyi import edin
3. Environment variables'ları ekleyin
4. Deploy edin

### PostgreSQL

Production için:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## 🔒 Güvenlik

- Şifreler bcrypt ile hash'lenir
- NextAuth.js ile güvenli authentication
- API route'ları session kontrolü yapar
- CSRF koruması
- SQL injection koruması (Prisma)

## 📱 Responsive Design

Mobil, tablet ve desktop için optimize edilmiş responsive tasarım.

## 🎨 Marka Renkleri

- Primary (Sarı): `#FFB703`
- Arka plan: Beyaz
- Metin: Koyu gri

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## 📞 İletişim

Sorularınız için: info@highwayburger.com

