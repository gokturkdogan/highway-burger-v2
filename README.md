# 🍔 Highway Burger - E-Commerce Platform

Modern ve kullanıcı dostu bir burger restoranı için geliştirilmiş full-stack e-ticaret platformu.

## 👨‍💻 Geliştirici

**Göktürk Doğan** tarafından fullstack olarak geliştirilmiştir.

## 🎯 Proje Hakkında

Highway Burger, müşterilerin online sipariş vermesini sağlayan, admin paneli ile sipariş ve ürün yönetimi yapılabilen modern bir web uygulamasıdır.

## 🛠️ Teknolojiler

### Frontend
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/ui** - UI component library
- **Zustand** - State management (cart)
- **React Query** - Server state management

### Backend
- **Next.js API Routes** - RESTful API
- **NextAuth.js** - Authentication
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database (Neon.tech)

### Entegrasyonlar
- **Iyzico** - Ödeme gateway
- **Cloudinary** - Görsel yönetimi
- **Resend** - Email servisi
- **Leaflet** - Harita entegrasyonu

### Deployment
- **Vercel** - Hosting platform

## ✨ Özellikler

### Müşteri Paneli
- 🏠 Modern ana sayfa ve kategori listeleme
- 🍔 Ürün detay ve sepet yönetimi
- 🛒 Dinamik alışveriş sepeti
- 🗺️ Harita ile adres seçimi
- 💳 Çoklu ödeme yöntemi (Nakit, Kart, Online)
- 📧 Email ile sipariş bildirimi
- 👤 Kullanıcı profil ve adres yönetimi
- 📦 Sipariş takibi

### Admin Paneli
- 📊 Dashboard ve istatistikler
- 🛍️ Sipariş yönetimi ve durum güncelleme
- 📦 Ürün ekleme, düzenleme ve silme
- 🗂️ Kategori yönetimi
- 🖼️ Cloudinary ile görsel yükleme
- 🗺️ Teslimat konum görüntüleme

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Environment variables ayarla
# .env.local dosyası oluştur

# Database migration
npx prisma migrate dev

# Seed data ekle
npx tsx prisma/seed.ts

# Geliştirme sunucusunu başlat
npm run dev
```

## 📄 Lisans

Bu proje Highway Burger için özel olarak geliştirilmiştir.

---

**Developed with ❤️ by Göktürk Doğan**
