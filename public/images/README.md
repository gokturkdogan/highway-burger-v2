# 📁 Static Images Klasör Yapısı

Bu klasörde projenin tüm static görselleri tutulmaktadır.

## 📂 Klasör Yapısı

```
public/images/
├── logo/           # Logo dosyaları
│   ├── shield-logo.svg
│   ├── highway-burger-logo.png
│   └── favicon.ico
├── products/       # Ürün görselleri
│   ├── burgers/
│   ├── drinks/
│   ├── sandwiches/
│   └── menus/
├── categories/     # Kategori görselleri
│   ├── burger-category.jpg
│   ├── drink-category.jpg
│   └── ...
└── icons/          # Icon dosyaları
    ├── cart-icon.svg
    ├── user-icon.svg
    └── ...
```

## 🎨 Logo Özellikleri

### Shield Logo
- **Boyut:** 32x40px
- **Renk:** Golden (#FFB703)
- **Format:** SVG (scalable)
- **İçerik:** Burger emoji (🍔)

### Brand Logo
- **Boyut:** Responsive
- **Renk:** Golden (#FFB703)
- **Format:** PNG/SVG
- **Text:** "HIGHWAY BURGER"

## 📱 Responsive Görseller

Tüm görseller responsive olarak tasarlanmıştır:
- **Mobile:** 1x
- **Tablet:** 2x
- **Desktop:** 3x

## 🔧 Kullanım

```tsx
import Image from 'next/image'

// Logo kullanımı
<Image
  src="/images/logo/shield-logo.svg"
  alt="Highway Burger Logo"
  width={32}
  height={40}
/>

// Ürün görseli kullanımı
<Image
  src="/images/products/burgers/classic-burger.jpg"
  alt="Classic Burger"
  fill
  className="object-cover"
/>
```

## 📋 Görsel Gereksinimleri

### Logo Dosyaları
- [ ] shield-logo.svg (SVG formatında)
- [ ] highway-burger-logo.png (PNG formatında)
- [ ] favicon.ico (16x16, 32x32, 48x48)

### Ürün Görselleri
- [ ] Burger kategorisi görselleri
- [ ] İçecek kategorisi görselleri
- [ ] Sandviç kategorisi görselleri
- [ ] Menü kategorisi görselleri

### Icon Dosyaları
- [ ] Sepet icon'u
- [ ] Kullanıcı icon'u
- [ ] Kategori icon'ları

---

**Son güncelleme:** 19 Ekim 2025
