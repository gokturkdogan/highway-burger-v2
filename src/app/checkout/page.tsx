'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CartSummary from '@/components/CartSummary'
import { useCart } from '@/hooks/useCart'
import axios from 'axios'
import Link from 'next/link'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, discount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    address: '',
    city: '',
  })

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Giriş Gerekli</h1>
        <p className="text-muted-foreground mb-8">
          Ödeme yapabilmek için giriş yapmalısınız
        </p>
        <Link href="/auth/login">
          <Button size="lg">Giriş Yap</Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-muted-foreground mb-8">
          Ödeme yapmak için önce sepetinize ürün eklemelisiniz
        </p>
        <Link href="/">
          <Button size="lg">Alışverişe Başla</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/checkout', {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        discount,
        shippingAddress: formData,
      })

      // Iyzico ödeme sayfasına yönlendir
      if (response.data.checkoutFormContent) {
        const div = document.createElement('div')
        div.innerHTML = response.data.checkoutFormContent
        document.body.appendChild(div)
        clearCart()
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Ödeme işlemi sırasında bir hata oluştu'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ad Soyad
                  </label>
                  <Input
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="Adınız ve Soyadınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefon
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Şehir</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="İstanbul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Adres</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Tam adresiniz"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'İşleniyor...' : 'Ödemeye Geç'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <CartSummary showCoupon={false} showCheckout={false} />
        </div>
      </div>
    </div>
  )
}

