# Cloudinary Kurulum Rehberi

## 1. Cloudinary Hesabı Oluştur

1. https://cloudinary.com adresine git
2. "Sign Up Free" butonuna tıkla
3. Ücretsiz hesap oluştur

## 2. Dashboard'dan Bilgileri Al

1. Giriş yaptıktan sonra Dashboard'a git
2. Şu bilgileri kopyala:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Environment Variables Ayarla

`.env.local` dosyası oluştur ve şu satırları ekle:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**ÖNEMLİ:** 
- `your-cloud-name`, `your-api-key`, `your-api-secret` yerine kendi bilgilerini yaz
- Tırnak işaretlerini koru

## 4. Kullanım

### Ürün Ekleme/Düzenleme

1. Admin paneline giriş yap: `/admin`
2. "Ürünler" menüsüne git: `/admin/products`
3. "Yeni Ürün Ekle" butonuna tıkla
4. Görsel yükle:
   - "Görsel Yükle" butonuna tıkla
   - Bilgisayarından görsel seç (PNG, JPG, WEBP)
   - "Yükle" butonuna tıkla
   - Görsel otomatik olarak Cloudinary'ye yüklenecek
5. Diğer bilgileri doldur
6. "Ekle" butonuna tıkla

### Klasör Yapısı

Görseller Cloudinary'de şu klasörde saklanır:
```
highway-burger/
  └── products/
      ├── product-1.jpg
      ├── product-2.jpg
      └── ...
```

### Otomatik Optimizasyon

Upload edilen görseller otomatik olarak:
- 800x800px maksimum boyuta küçültülür
- Kalite optimize edilir
- Modern formata (WebP gibi) dönüştürülür

## 5. Test Et

1. Yeni bir ürün ekle
2. Görsel yükle
3. Prisma Studio'da (`npx prisma studio`) kontrol et:
   - `imageUrl` field'ında Cloudinary URL'si olmalı
   - URL formatı: `https://res.cloudinary.com/your-cloud-name/image/upload/...`

## 6. Ücretsiz Plan Limitleri

- **Depolama**: 25 GB
- **Bant Genişliği**: 25 GB/ay
- **Transformasyon**: 25,000/ay

Bu limitler küçük-orta ölçekli projeler için yeterli!

## Sorun Giderme

### "Görsel yüklenemedi" hatası alıyorum

1. `.env.local` dosyasındaki bilgilerin doğru olduğundan emin ol
2. Cloudinary Dashboard'da API Key'in aktif olduğunu kontrol et
3. Dosya boyutunun 5MB'dan küçük olduğunu kontrol et

### Görsel yükleniyor ama görünmüyor

1. Cloudinary Dashboard > Media Library'ye git
2. `highway-burger/products` klasörünü kontrol et
3. Görsel orada mı?
4. Prisma Studio'da `imageUrl` field'ını kontrol et

### CORS hatası alıyorum

Cloudinary otomatik olarak CORS izinlerini ayarlar, sorun olmamalı. 
Eğer sorun yaşıyorsan, Cloudinary Dashboard > Settings > Security > Allowed domains kısmına `localhost:3000` ekle.

