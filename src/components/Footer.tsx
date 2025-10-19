export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Highway Burger</h3>
            <p className="text-sm text-muted-foreground">
              En lezzetli burgerleri kapınıza getiriyoruz. Taze malzemeler,
              özenle hazırlanan tarifler.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary">
                  Anasayfa
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sepetim
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="text-muted-foreground hover:text-primary"
                >
                  Giriş Yap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 info@highwayburger.com</li>
              <li>📞 +90 (555) 123 4567</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 Highway Burger. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

