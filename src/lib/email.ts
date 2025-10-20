import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sipariş onay maili gönder
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderId: number
    name: string
    total: number
    items: Array<{ 
      name: string
      quantity: number
      price: number
      extraText?: string
      selectedOption?: string
    }>
    shippingAddress: {
      fullName: string
      phone: string
      city: string
      district: string
      fullAddress: string
    }
    paymentMethod: string
  }
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Order confirmation would be sent to:', email)
      console.log('   Order ID:', orderData.orderId)
      console.log('   Total:', orderData.total, 'TL')
      return { success: true, message: 'Email skipped (no API key)' }
    }

    // Format price
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(amount)
    }

    // Generate items HTML
    const itemsHtml = orderData.items.map(item => {
      const extraInfo = item.extraText && item.selectedOption
        ? item.selectedOption === 'first' 
          ? item.extraText.split('/')[0] 
          : item.extraText.split('/')[1] || item.extraText
        : ''
      
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 600; color: #2d3748; margin-bottom: 4px;">
              ${item.name}
              ${extraInfo ? `<span style="color: #bb7c05; font-size: 12px; margin-left: 8px;">(${extraInfo})</span>` : ''}
            </div>
            <div style="font-size: 14px; color: #718096;">
              ${item.quantity} adet × ${formatPrice(item.price)}
            </div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #2d3748;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `
    }).join('')

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Highway Burger <onboarding@resend.dev>',
      to: [email],
      subject: `🍔 Siparişiniz Alındı! #${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sipariş Onayı</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Success Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #bb7c05 0%, #d49624 100%); padding: 40px 30px; text-align: center;">
                        <div style="font-size: 60px; margin-bottom: 15px;">🍔</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Siparişiniz Alındı!</h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                          Sipariş No: #${orderData.orderId}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 600;">
                          Merhaba ${orderData.name}! 👋
                        </h2>
                        
                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Siparişiniz başarıyla alındı! Lezzetli burgerleriniz en kısa sürede hazırlanıp size ulaştırılacak.
                        </p>
                        
                        <!-- Delivery Time -->
                        <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #bb7c05;">
                          <div style="font-size: 24px; margin-bottom: 8px;">⏰</div>
                          <div style="font-weight: 700; color: #bb7c05; font-size: 18px; margin-bottom: 5px;">Tahmini Teslimat</div>
                          <div style="color: #2d3748; font-size: 20px; font-weight: 600;">15-25 dakika</div>
                        </div>
                        
                        <!-- Order Items -->
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bb7c05; padding-bottom: 10px;">
                          📦 Sipariş Detayları
                        </h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                          ${itemsHtml}
                        </table>
                        
                        <!-- Price Summary -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; background-color: #fef5e7; border-radius: 8px; padding: 20px; border: 2px solid #bb7c05;">
                          <tr style="border-top: 2px solid #e2e8f0;">
                            <td style="padding: 12px 0; color: #2d3748; font-size: 18px; font-weight: 700;">Toplam Tutar:</td>
                            <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #bb7c05; font-size: 24px;">${formatPrice(orderData.total)}</td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding: 8px 0 0 0; color: #4a5568; font-size: 14px;">
                              Ödeme Yöntemi: <strong>${orderData.paymentMethod}</strong>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Shipping Address -->
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bb7c05; padding-bottom: 10px;">
                          🏠 Teslimat Adresi
                        </h3>
                        <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 15px; font-weight: 600;">
                            ${orderData.shippingAddress.fullName}
                          </p>
                          <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                            📞 ${orderData.shippingAddress.phone}
                          </p>
                          <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                            📍 ${orderData.shippingAddress.city} / ${orderData.shippingAddress.district}
                          </p>
                          <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                            ${orderData.shippingAddress.fullAddress}
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          Afiyet olsun! 🍔
                        </p>
                        <p style="margin: 0 0 15px 0; color: #a0aec0; font-size: 12px;">
                          Bu mail ${email} adresine sipariş onayı olarak gönderilmiştir.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          © ${new Date().getFullYear()} Highway Burger. Tüm hakları saklıdır.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Order confirmation email error:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Order confirmation email sent to:', email, '| Order:', orderData.orderId)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Order email error:', error)
    return { success: false, error: error.message }
  }
}

