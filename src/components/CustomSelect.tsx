'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface CustomSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export default function CustomSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Seçiniz',
  required = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 border-2 rounded-xl outline-none transition-all duration-200 text-left flex items-center justify-between ${
          isOpen
            ? 'border-[#bb7c05]'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-transparent'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-[#bb7c05]' : ''
        }`} />
      </button>

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          value || isOpen
            ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
            : 'top-1/2 -translate-y-1/2 text-gray-500'
        }`}
      >
        {label}
      </label>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#bb7c05]/30 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between ${
                  value === option.value
                    ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 text-[#bb7c05] font-bold'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-5 h-5 text-[#bb7c05]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

