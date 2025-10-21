import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { orderEvents } from '@/lib/events'

// Node.js runtime kullan (SSE için gerekli)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Admin kontrolü
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 })
  }

  // SSE headers
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Nginx için
  })

  // Readable stream oluştur
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Ping her 30 saniyede
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'))
        } catch (error) {
          console.error('Ping error:', error)
        }
      }, 30000)

      // Yeni sipariş event listener
      const listener = (data: any) => {
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (error) {
          console.error('Event emit error:', error)
        }
      }

      orderEvents.addListener(listener)

      // İlk bağlantı mesajı
      console.log('✅ SSE Client connected')
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      // Cleanup
      const cleanup = () => {
        clearInterval(pingInterval)
        orderEvents.removeListener(listener)
        try {
          controller.close()
        } catch (error) {
          // Already closed
        }
      }

      // Request iptal edildiğinde cleanup
      request.signal.addEventListener('abort', cleanup)

      return cleanup
    },
  })

  return new Response(stream, { headers })
}

