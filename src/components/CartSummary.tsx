'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import axios from 'axios'

interface CartSummaryProps {
  showCoupon?: boolean
  showCheckout?: boolean
}

export default function CartSummary({
  showCoupon = true,
  showCheckout = true,
}: CartSummaryProps) {
  const { getTotal, getTotalWithDiscount, discount, couponCode, applyCoupon, removeCoupon } =
    useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  const total = getTotal()
  const totalWithDiscount = getTotalWithDiscount()

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return

    setCouponLoading(true)
    setCouponError('')

    try {
      const response = await axios.get(
        `/api/coupons?code=${couponInput.trim()}`
      )
      applyCoupon(response.data.code, response.data.discountPercent)
      setCouponInput('')
    } catch (error: any) {
      setCouponError(
        error.response?.data?.error || 'Kupon kodu geçersiz'
      )
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Özeti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ara Toplam</span>
            <span>{formatPrice(total)}</span>
          </div>

          {discount > 0 && (
            <>
              <div className="flex justify-between text-sm text-green-600">
                <span>İndirim ({discount}%)</span>
                <span>-{formatPrice(total - totalWithDiscount)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    Kupon: {couponCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                  >
                    Kaldır
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="pt-2 border-t">
            <div className="flex justify-between font-bold text-lg">
              <span>Toplam</span>
              <span className="text-primary">{formatPrice(totalWithDiscount)}</span>
            </div>
          </div>
        </div>

        {showCoupon && !couponCode && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Kupon Kodu"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                disabled={couponLoading}
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                variant="outline"
              >
                {couponLoading ? 'Kontrol...' : 'Uygula'}
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-destructive">{couponError}</p>
            )}
          </div>
        )}

        {showCheckout && (
          <Button className="w-full" size="lg" asChild>
            <a href="/checkout">Ödemeye Geç</a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

