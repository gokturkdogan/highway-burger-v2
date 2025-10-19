# 🐘 Neon PostgreSQL Kurulum Rehberi

Neon üzerinde ücretsiz PostgreSQL veritabanı oluşturma ve projeye bağlama rehberi.

## 🌟 Neon Nedir?

Neon, serverless PostgreSQL hizmeti sunan modern bir platform:
- ✅ **Ücretsiz tier** (başlangıç için ideal)
- ✅ **Auto-scaling** (kullanıma göre otomatik ölçeklenir)
- ✅ **Instant branching** (database branch'leri)
- ✅ **Zero-downtime** deployments
- ✅ **Güvenli** ve hızlı

## 📝 Adım Adım Kurulum

### 1️⃣ Neon Hesabı Oluşturma

1. **Web sitesine gidin:** https://neon.tech
2. **"Sign Up" butonuna tıklayın**
3. **GitHub ile giriş yapın** (önerilen) veya email kullanın
4. Email doğrulamasını tamamlayın

### 2️⃣ Yeni Proje Oluşturma

Dashboard'da:

1. **"Create a Project" veya "+ New Project" butonuna tıklayın**

2. **Proje bilgilerini girin:**
   ```
   Project name: highway-burger
   Region: AWS / Europe (Frankfurt) - Size en yakın olanı seçin
   PostgreSQL version: 16 (varsayılan)
   ```

3. **"Create Project" butonuna tıklayın**

4. ⏳ **Birkaç saniye bekleyin** - Neon veritabanınızı oluşturacak

### 3️⃣ Connection String'i Alma

Proje oluşturulduktan sonra **Connection Details** sayfası açılacak:

1. **"Pooled connection" seçeneğini seçin** (önemli!)
   - Connection pooling performans için gerekli
   
2. **Connection string'i kopyalayın:**
   ```
   postgresql://username:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

3. **💾 Güvenli bir yere kaydedin** (bir sonraki adımda kullanacağız)

**Örnek Connection String:**
```
postgresql://myuser:AbCd1234XyZ@ep-cool-butterfly-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 4️⃣ .env Dosyasını Güncelleme

Proje klasöründe `.env` dosyasını açın ve `DATABASE_URL` satırını güncelleyin:

```bash
# .env dosyası
DATABASE_URL="postgresql://myuser:AbCd1234XyZ@ep-cool-butterfly-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
IYZICO_API_KEY="sandbox-test"
IYZICO_SECRET_KEY="sandbox-test"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**⚠️ Önemli:** Connection string'inizin sonunda `?sslmode=require` olduğundan emin olun!

### 5️⃣ Prisma Migration Çalıştırma

Terminal'de sırasıyla şu komutları çalıştırın:

```bash
# 1. Prisma Client'ı generate et
npx prisma generate

# 2. Migration'ları çalıştır (veritabanı tablolarını oluşturur)
npx prisma migrate deploy

# veya development için:
npx prisma migrate dev --name init

# 3. Seed data ekle (örnek ürünler, kategoriler, kullanıcı)
npx prisma db seed
```

**Her komutun başarılı olduğundan emin olun!**

### 6️⃣ Bağlantıyı Test Etme

Prisma Studio ile veritabanını kontrol edin:

```bash
npx prisma studio
```

Tarayıcıda `http://localhost:5555` açılacak ve tablolarınızı göreceksiniz:
- ✅ User
- ✅ Category
- ✅ Product
- ✅ Coupon
- ✅ Order
- ✅ OrderItem

### 7️⃣ Uygulamayı Başlatma

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açın ve siteyi test edin!

---

## 🔍 Neon Dashboard Özellikleri

### Tables Tab
- Tablolarınızı görün
- Row sayılarını kontrol edin
- Query çalıştırın

### SQL Editor
- SQL sorguları yazın
- Test query'leri çalıştırın
- Database'i explore edin

### Branches
- Development branch'i oluşturun
- Test verileri ile deneme yapın
- Main branch'e merge edin

### Usage
- Storage kullanımını görün
- Compute time'ı takip edin
- Free tier limitlerini kontrol edin

---

## 🎯 Hızlı Komutlar

```bash
# Connection'ı test et
npx prisma db push

# Prisma Studio'yu aç
npx prisma studio

# Migration oluştur
npx prisma migrate dev --name add_new_feature

# Production'a deploy
npx prisma migrate deploy

# Veritabanını resetle (DİKKAT: Tüm veri silinir!)
npx prisma migrate reset
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Connection String Güvenliği
```bash
# ❌ YANLIŞ - Git'e commit etmeyin!
git add .env

# ✅ DOĞRU - .env dosyası .gitignore'da
cat .gitignore | grep .env
```

### 2. SSL Mode
Neon **SSL bağlantı gerektirir**. Connection string'inizde mutlaka:
```
?sslmode=require
```
bulunmalı!

### 3. Pooled Connection
- Development: Pooled connection kullanın
- Production: Mutlaka pooled connection
- Serverless: Connection pooling şart

### 4. Free Tier Limitler
- **Storage:** 3 GB
- **Compute:** 100 saat/ay
- **Projects:** 10 adet
- **Branches:** Sınırsız

---

## 🐛 Sorun Giderme

### "Can't reach database server" Hatası

**Çözüm 1:** Connection string'i kontrol edin
```bash
# .env dosyasında DATABASE_URL'i kontrol edin
cat .env | grep DATABASE_URL
```

**Çözüm 2:** SSL mode ekleyin
```
DATABASE_URL="...?sslmode=require"
```

**Çözüm 3:** Prisma'yı yeniden generate edin
```bash
npx prisma generate
```

### "SSL connection required" Hatası

Connection string'inizin sonuna ekleyin:
```
?sslmode=require
```

### Migration Hatası

```bash
# Reset ve yeniden dene (DİKKAT: Veri silinir!)
npx prisma migrate reset

# Veya
npx prisma db push
npx prisma db seed
```

### Prisma Client Hatası

```bash
# Prisma Client'ı temizle ve yeniden oluştur
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 🚀 Production Deploy (Vercel)

### 1. Vercel Dashboard
- Projenizi import edin
- Environment Variables ekleyin

### 2. Environment Variables
```
DATABASE_URL = [Neon connection string]
NEXTAUTH_SECRET = [güvenli secret]
NEXTAUTH_URL = https://yourdomain.vercel.app
IYZICO_API_KEY = [production key]
IYZICO_SECRET_KEY = [production secret]
IYZICO_BASE_URL = https://api.iyzipay.com
NEXT_PUBLIC_BASE_URL = https://yourdomain.vercel.app
```

### 3. Deploy
```bash
git push origin main
# Vercel otomatik deploy eder
```

### 4. Migration
Vercel deploy sonrası:
```bash
# Local'den production'a migrate
DATABASE_URL="production-url" npx prisma migrate deploy
```

---

## 💡 Pro Tips

### 1. Branch Strategy
```bash
# Development branch oluştur
# Neon Dashboard > Branches > Create Branch
# Test verilerini development branch'te tut
# Production'a merge etmeden önce test et
```

### 2. Backup
- Neon otomatik backup alır
- Point-in-time recovery mevcut
- Dashboard > Restore sekmesinden restore edebilirsiniz

### 3. Monitoring
- Neon Dashboard'da query performance görün
- Slow query'leri optimize edin
- Connection pool kullanımını takip edin

### 4. Environment'lar
```bash
# .env.development
DATABASE_URL="neon-dev-connection"

# .env.production  
DATABASE_URL="neon-prod-connection"
```

---

## 📚 Faydalı Linkler

- **Neon Dashboard:** https://console.neon.tech
- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Prisma + Neon Guide:** https://www.prisma.io/docs/guides/database/using-prisma-with-neon

---

## ✅ Kurulum Checklist

- [ ] Neon hesabı oluşturuldu
- [ ] Yeni proje oluşturuldu
- [ ] Connection string kopyalandı
- [ ] .env dosyası güncellendi
- [ ] `npx prisma generate` çalıştırıldı
- [ ] `npx prisma migrate deploy` çalıştırıldı
- [ ] `npx prisma db seed` çalıştırıldı
- [ ] `npx prisma studio` ile kontrol edildi
- [ ] `npm run dev` ile uygulama çalıştırıldı
- [ ] Test kullanıcı ile giriş yapıldı
- [ ] Ürünler görüntülendi

---

## 🎉 Tebrikler!

Neon PostgreSQL veritabanınız hazır! Artık tamamen cloud-based bir veritabanı ile çalışıyorsunuz. 

**İyi kodlamalar!** 🚀

---

*Son güncelleme: 19 Ekim 2025*

