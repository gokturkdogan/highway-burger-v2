// Global event emitter (singleton pattern)
class OrderEventEmitter {
  private listeners: Set<(data: any) => void> = new Set()

  addListener(listener: (data: any) => void) {
    this.listeners.add(listener)
    console.log('✅ Listener added. Total listeners:', this.listeners.size)
  }

  removeListener(listener: (data: any) => void) {
    this.listeners.delete(listener)
    console.log('❌ Listener removed. Total listeners:', this.listeners.size)
  }

  emit(data: any) {
    console.log('📢 Emitting event to', this.listeners.size, 'listeners:', data)
    this.listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error('Listener error:', error)
      }
    })
  }
}

// Global instance - singleton
const globalForEvents = global as unknown as {
  orderEvents: OrderEventEmitter | undefined
}

export const orderEvents = globalForEvents.orderEvents ?? new OrderEventEmitter()

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.orderEvents = orderEvents
}

