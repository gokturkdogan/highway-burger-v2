# 💳 Iyzico Entegrasyonu Rehberi

Bu dokümanda Iyzico ödeme sistemi entegrasyonunun nasıl yapıldığı ve test edildiği anlatılmaktadır.

## 🎯 Genel Bakış

Highway Burger projesinde Iyzico'nun **Checkout Form** çözümü kullanılmıştır. Bu çözüm:

- Hazır ödeme formu sağlar
- PCI-DSS uyumludur (kredi kartı bilgilerini sizin sunucunuzda tutmazsınız)
- 3D Secure destekler
- Taksit seçenekleri sunar
- Hızlı entegrasyon imkanı verir

## 📋 Ön Hazırlık

### 1. Iyzico Hesabı Oluşturma

1. [Iyzico Merchant Panel](https://merchant.iyzipay.com/)'e gidin
2. Kayıt olun
3. Test merchant hesabı için başvurun

### 2. API Anahtarlarını Alma

Merchant Panel'de:
- **Ayarlar** > **API Bilgileri**
- **API Key** ve **Secret Key** değerlerini kopyalayın

### 3. Sandbox/Test Ortamı

Geliştirme sırasında sandbox kullanın:
- URL: `https://sandbox-api.iyzipay.com`
- Test kartları ile ödeme yapabilirsiniz
- Gerçek para harcanmaz

## 🔧 Proje Entegrasyonu

### Environment Variables

`.env` dosyasına ekleyin:

```env
IYZICO_API_KEY="sandbox-YOUR_API_KEY"
IYZICO_SECRET_KEY="sandbox-YOUR_SECRET_KEY"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

### Kod Yapısı

**1. Iyzico Client (`src/lib/iyzico.ts`):**
```typescript
import Iyzipay from 'iyzipay'

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || '',
  secretKey: process.env.IYZICO_SECRET_KEY || '',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
})
```

**2. Checkout API Route (`src/app/api/checkout/route.ts`):**
- Kullanıcı ve sepet doğrulaması
- Sipariş kaydı
- Iyzico checkout form oluşturma
- Checkout form HTML'ini döndürme

**3. Callback Sayfası (`src/app/checkout/callback/page.tsx`):**
- Ödeme sonucu yönlendirmesi
- Başarılı/Başarısız durumları

## 🧪 Test Kartları

Sandbox ortamında test için kullanılabilecek kartlar:

### Başarılı İşlem

| Kart Numarası      | CVV | Son Kullanma |
|-------------------|-----|--------------|
| 5528790000000008  | 123 | 12/30        |
| 4603450000000000  | 123 | 12/30        |

### 3D Secure Şifresi
Test kartlarında 3D Secure için şifre: **123456**

### Başarısız İşlemler

Özel test kartları ile farklı hata senaryolarını test edebilirsiniz.
[Iyzico Test Kartları Dokümantasyonu](https://dev.iyzipay.com/tr/test-kartlari)

## 🔄 Ödeme Akışı

### 1. Checkout Formu Oluşturma

```
Kullanıcı "Ödemeye Geç" butonuna tıklar
    ↓
Frontend → POST /api/checkout
    ↓
Backend:
  - Session kontrolü
  - Sipariş kaydı oluştur
  - Iyzico'ya checkout form isteği
    ↓
Iyzico checkout form HTML döner
    ↓
Frontend sayfada Iyzico formu gösterir
```

### 2. Ödeme İşlemi

```
Kullanıcı kart bilgilerini girer
    ↓
Iyzico ödemeyi işler
    ↓
Callback URL'e yönlendirir
    ↓
/checkout/callback?token=xxx&status=success
```

### 3. Sipariş Durumu Güncelleme

Callback sayfasında:
- Token ile ödeme doğrulanır
- Sipariş durumu güncellenir
- Kullanıcıya sonuç gösterilir

## 📝 Önemli Parametreler

### basketItems

Her ürün için:
```typescript
{
  id: "product_id",
  name: "Product Name",
  category1: "Food",
  itemType: "PHYSICAL",
  price: "100.00" // String formatında
}
```

### buyer

Alıcı bilgileri:
```typescript
{
  id: "user_id",
  name: "Ad",
  surname: "Soyad",
  gsmNumber: "+905551234567",
  email: "email@example.com",
  identityNumber: "11111111111",
  registrationAddress: "Adres",
  ip: "127.0.0.1",
  city: "Istanbul",
  country: "Turkey"
}
```

### Adres Bilgileri

shippingAddress ve billingAddress aynı formatta:
```typescript
{
  contactName: "Ad Soyad",
  city: "Istanbul",
  country: "Turkey",
  address: "Tam adres"
}
```

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Fiyat Formatı
```typescript
// Doğru
price: "100.50"

// Yanlış
price: 100.50  // Number değil, string olmalı
```

### 2. Callback URL
```typescript
callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/callback`
```
- Production'da gerçek domain kullanın
- HTTPS olmalı
- Iyzico'nun erişebileceği bir URL olmalı

### 3. Conversation ID
- Her işlem için unique olmalı
- Sipariş ID'si kullanılabilir
- Loglama ve tracking için önemli

### 4. TCMB Kimlik Numarası
Test ortamında `11111111111` kullanılabilir.
Production'da gerçek TCKN gerekli.

## 🚀 Production'a Geçiş

### 1. Production Anahtarları
```env
IYZICO_API_KEY="your_production_api_key"
IYZICO_SECRET_KEY="your_production_secret_key"
IYZICO_BASE_URL="https://api.iyzipay.com"
```

### 2. Gerçek Veriler
- Gerçek müşteri bilgileri
- Gerçek TCKN numaraları
- Gerçek adres bilgileri

### 3. Güvenlik
- HTTPS kullanın
- API anahtarlarını güvende tutun
- Environment variables kullanın
- Git'e commit etmeyin

### 4. Webhook (Opsiyonel)
Sipariş durumlarını otomatik güncellemek için webhook kurabilirsiniz:
- Merchant Panel'den webhook URL tanımlayın
- `/api/webhooks/iyzico` endpoint'i oluşturun
- Ödeme durumu değişikliklerini dinleyin

## 🔍 Debug İpuçları

### 1. Console Logs
```typescript
console.log('Iyzico Request:', iyzicoRequest)
console.log('Iyzico Response:', iyzicoResult)
```

### 2. Hata Mesajları
Iyzico yanıtında `errorMessage` ve `errorCode` kontrol edin:
```typescript
if (iyzicoResult.status !== 'success') {
  console.error('Iyzico Error:', iyzicoResult.errorMessage)
}
```

### 3. Network Tab
Browser Developer Tools'da:
- Network tab'i açın
- `/api/checkout` isteğini inceleyin
- Request/Response payload'larını kontrol edin

## 📚 Kaynaklar

- [Iyzico API Dokümantasyonu](https://dev.iyzipay.com/)
- [Checkout Form Dokümantasyonu](https://dev.iyzipay.com/tr/checkout-form)
- [Test Kartları](https://dev.iyzipay.com/tr/test-kartlari)
- [Hata Kodları](https://dev.iyzipay.com/tr/hata-kodlari)
- [Merchant Panel](https://merchant.iyzipay.com/)

## 💡 Best Practices

1. **Error Handling:** Tüm Iyzico API çağrılarında try-catch kullanın
2. **Logging:** Önemli işlemleri logla (production'da detaylı)
3. **Timeout:** API çağrıları için timeout belirleyin
4. **Retry Logic:** Başarısız istekler için retry mekanizması
5. **User Feedback:** Kullanıcıya net mesajlar gösterin
6. **Security:** Hassas bilgileri loglamayın

## 🎯 Sonraki Adımlar

- [ ] Webhook entegrasyonu
- [ ] Email bildirimler
- [ ] SMS bildirimler
- [ ] Sipariş takip sistemi
- [ ] İade ve iptal işlemleri
- [ ] Raporlama ve analiz

---

**Not:** Bu döküman sadece temel entegrasyon içindir. Production ortamında ek güvenlik önlemleri ve compliance gereksinimleri olabilir.

