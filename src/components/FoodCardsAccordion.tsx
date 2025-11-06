'use client'

import { useState } from 'react'
import { ChevronDown, CreditCard } from 'lucide-react'

interface FoodCard {
  name: string
  imageUrl: string | null
  isActive: boolean
}

interface FoodCardsAccordionProps {
  cards: FoodCard[]
}

export default function FoodCardsAccordion({ cards }: FoodCardsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Sadece aktif kartları filtrele
  const activeCards = cards.filter(card => card.isActive !== false)

  if (activeCards.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Accordion - Tek element, kendisi genişliyor */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        className={`w-full bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100 transition-all duration-500 ease-in-out overflow-hidden group cursor-pointer ${
          isOpen ? 'shadow-md' : ''
        }`}
      >
        {/* Header Section - Sabit kalacak */}
        <div className="flex items-start justify-between p-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="text-left pt-0.5">
              <div className="font-bold text-amber-900 text-sm">Geçerli Yemek Kartları</div>
              <div className="text-xs text-amber-700">{activeCards.length} kart kabul ediliyor</div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-amber-700 transition-transform duration-300 flex-shrink-0 mt-1 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Content Section - Sadece bu kısım genişliyor */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pl-11 pr-3 pb-3 space-y-2.5">
            {activeCards.map((card, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-white via-amber-50/50 to-white rounded-lg border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-300"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animation: isOpen ? 'fadeInUp 0.3s ease-out forwards' : 'none'
                }}
              >
                {/* Card Image - Compact görsel */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-amber-200 bg-white shadow-sm">
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Card Name */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-0.5">{card.name}</h4>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Bu kart kabul ediliyor
                  </p>
                </div>

                {/* Check Icon */}
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

