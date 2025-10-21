import { Resend } from 'resend'
import prisma from './prisma'

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

    // Store settings'den teslimat süresini al
    const storeSettings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    })

    // Teslimat süresini belirle
    const getDeliveryTime = (deliveryStatus: string) => {
      switch (deliveryStatus) {
        case 'normal':
          return '15-25 dakika'
        case 'busy':
          return '30-45 dakika'
        case 'very_busy':
          return '45-60 dakika'
        default:
          return '15-25 dakika'
      }
    }

    const deliveryTime = getDeliveryTime(storeSettings?.deliveryStatus || 'normal')

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
      from: process.env.EMAIL_FROM || 'Highway Burger <noreply@highwayburger.com.tr>',
      to: [email],
      subject: `Siparişiniz Alındı! #${orderData.orderId}`,
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
                          <div style="color: #2d3748; font-size: 20px; font-weight: 600;">${deliveryTime}</div>
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

/**
 * Yeni üye hoşgeldin maili gönder
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Welcome email would be sent to:', email)
      console.log('   Name:', name)
      return { success: true, message: 'Email skipped (no API key)' }
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Highway Burger <noreply@highwayburger.com.tr>',
      to: [email],
      subject: `Highway Burger'e Hoşgeldiniz!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hoşgeldiniz</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Welcome Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #bb7c05 0%, #d49624 100%); padding: 50px 30px; text-align: center;">
                        <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Hoşgeldiniz!</h1>
                        <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">
                          Highway Burger ailesine katıldığınız için teşekkürler!
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 50px 30px;">
                        <h2 style="margin: 0 0 25px 0; color: #2d3748; font-size: 24px; font-weight: 600; text-align: center;">
                          Merhaba ${name}! 👋
                        </h2>
                        
                        <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
                          Artık Highway Burger'in bir parçasısınız! En lezzetli burgerleri, hızlı teslimatı ve özel kampanyaları keşfetmeye hazır mısınız?
                        </p>
                        
                        <!-- Features -->
                        <div style="margin-bottom: 40px;">
                          <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 20px; font-weight: 600; text-align: center;">
                            🍔 Neler Sunuyoruz?
                          </h3>
                          
                          <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #bb7c05;">
                              <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
                              <div style="font-weight: 700; color: #bb7c05; font-size: 16px; margin-bottom: 5px;">Hızlı Teslimat</div>
                              <div style="color: #2d3748; font-size: 14px;">15-25 dakikada kapınızda!</div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #38a169;">
                              <div style="font-size: 24px; margin-bottom: 8px;">🍔</div>
                              <div style="font-weight: 700; color: #38a169; font-size: 16px; margin-bottom: 5px;">Taze Malzemeler</div>
                              <div style="color: #2d3748; font-size: 14px;">Her gün taze hazırlanan burgerler</div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #e6f3ff 0%, #b3d9ff 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #3182ce;">
                              <div style="font-size: 24px; margin-bottom: 8px;">🎁</div>
                              <div style="font-weight: 700; color: #3182ce; font-size: 16px; margin-bottom: 5px;">Özel Kampanyalar</div>
                              <div style="color: #2d3748; font-size: 14px;">Üyelere özel indirimler ve hediyeler</div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 40px;">
                          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
                             style="display: inline-block; background: linear-gradient(135deg, #bb7c05 0%, #d49624 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(187, 124, 5, 0.3);">
                            🍔 Sipariş Vermeye Başla
                          </a>
                        </div>
                        
                        <!-- Tips -->
                        <div style="background-color: #f7fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                          <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; text-align: center;">
                            💡 İpuçları
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                            <li style="margin-bottom: 8px;">Favori adreslerinizi kaydederek hızlı sipariş verebilirsiniz</li>
                            <li style="margin-bottom: 8px;">Kampanya kodlarını takip ederek indirimlerden yararlanın</li>
                            <li style="margin-bottom: 8px;">Siparişlerinizi profil sayfanızdan takip edebilirsiniz</li>
                            <li>Sorularınız için müşteri hizmetlerimiz 7/24 hizmetinizde</li>
                          </ul>
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
                          Bu mail ${email} adresine hoşgeldin mesajı olarak gönderilmiştir.
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
      console.error('❌ Welcome email error:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Welcome email sent to:', email, '| Name:', name)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Welcome email error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sipariş durumu değişikliği maili gönder
 */
export async function sendOrderStatusEmail(
  email: string,
  orderData: {
    orderId: number
    name: string
    status: string
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
      console.log('📧 [DEV] Order status email would be sent to:', email)
      console.log('   Order ID:', orderData.orderId, '| Status:', orderData.status)
      return { success: true, message: 'Email skipped (no API key)' }
    }

    // Durum mesajlarını belirle
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'preparing':
          return {
            title: 'Siparişiniz Hazırlanıyor! 👨‍🍳',
            message: 'Lezzetli burgerleriniz şu an mutfakta hazırlanıyor. Çok yakında yola çıkacak!',
            icon: '👨‍🍳',
            color: '#f59e0b',
            bgColor: '#fef3c7'
          }
        case 'on_the_way':
          return {
            title: 'Siparişiniz Yolda! 🚚',
            message: 'Siparişiniz teslimat için yola çıktı! Motokuryemiz yakında kapınızda olacak.',
            icon: '🚚',
            color: '#3b82f6',
            bgColor: '#dbeafe'
          }
        case 'delivered':
          return {
            title: 'Siparişiniz Teslim Edildi! ✅',
            message: 'Siparişiniz başarıyla teslim edildi! Afiyet olsun, tekrar sipariş vermeyi unutmayın!',
            icon: '✅',
            color: '#10b981',
            bgColor: '#d1fae5'
          }
        case 'cancelled':
          return {
            title: 'Siparişiniz İptal Edildi ❌',
            message: 'Maalesef siparişiniz iptal edilmiştir. Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.',
            icon: '❌',
            color: '#ef4444',
            bgColor: '#fee2e2'
          }
        default:
          return {
            title: 'Sipariş Durumu Güncellendi 📦',
            message: 'Siparişinizin durumu güncellenmiştir.',
            icon: '📦',
            color: '#6b7280',
            bgColor: '#f3f4f6'
          }
      }
    }

    const statusInfo = getStatusInfo(orderData.status)

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
      from: process.env.EMAIL_FROM || 'Highway Burger <noreply@highwayburger.com.tr>',
      to: [email],
      subject: `${statusInfo.title} - Sipariş #${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sipariş Durumu</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Status Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); padding: 40px 30px; text-align: center;">
                        <div style="font-size: 60px; margin-bottom: 15px;">${statusInfo.icon}</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${statusInfo.title}</h1>
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
                          ${statusInfo.message}
                        </p>
                        
                        <!-- Status Info -->
                        <div style="background: ${statusInfo.bgColor}; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid ${statusInfo.color};">
                          <div style="font-size: 24px; margin-bottom: 8px;">${statusInfo.icon}</div>
                          <div style="font-weight: 700; color: ${statusInfo.color}; font-size: 18px; margin-bottom: 5px;">Güncel Durum</div>
                          <div style="color: #2d3748; font-size: 20px; font-weight: 600;">${statusInfo.title}</div>
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

                        ${orderData.status === 'delivered' ? `
                        <!-- CTA for delivered orders -->
                        <div style="text-align: center; margin-bottom: 30px;">
                          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
                             style="display: inline-block; background: linear-gradient(135deg, #bb7c05 0%, #d49624 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(187, 124, 5, 0.3);">
                            🍔 Tekrar Sipariş Ver
                          </a>
                        </div>
                        ` : ''}
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          Afiyet olsun! 🍔
                        </p>
                        <p style="margin: 0 0 15px 0; color: #a0aec0; font-size: 12px;">
                          Bu mail ${email} adresine sipariş durumu güncellemesi olarak gönderilmiştir.
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
      console.error('❌ Order status email error:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Order status email sent to:', email, '| Order:', orderData.orderId, '| Status:', orderData.status)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Order status email error:', error)
    return { success: false, error: error.message }
  }
}

