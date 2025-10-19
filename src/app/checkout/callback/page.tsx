'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

export default function CheckoutCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    const paymentStatus = searchParams.get('status')

    // Iyzico'dan dönen token ve status'e göre işlem
    if (paymentStatus === 'success' || token) {
      setStatus('success')
    } else {
      setStatus('failed')
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Ödeme durumu kontrol ediliyor...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Ödeme Başarılı!</h1>
        <p className="text-muted-foreground mb-8">
          Siparişiniz başarıyla alındı. En kısa sürede hazırlanacaktır.
        </p>
        <Link href="/">
          <Button size="lg">Anasayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <XCircle className="w-24 h-24 text-destructive mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Ödeme Başarısız</h1>
      <p className="text-muted-foreground mb-8">
        Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="space-x-4">
        <Link href="/cart">
          <Button size="lg" variant="outline">
            Sepete Dön
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg">Anasayfaya Dön</Button>
        </Link>
      </div>
    </div>
  )
}

