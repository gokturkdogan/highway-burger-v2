'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  type = 'danger'
}: ConfirmModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      document.body.style.overflow = 'unset'
      setIsAnimating(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleConfirm = () => {
    onConfirm()
    handleClose()
  }

  if (!isOpen) return null

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: 'bg-gradient-to-r from-red-600 to-red-700',
          confirmHover: 'hover:from-red-700 hover:to-red-800'
        }
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
          confirmHover: 'hover:from-yellow-700 hover:to-yellow-800'
        }
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          confirmHover: 'hover:from-blue-700 hover:to-blue-800'
        }
    }
  }

  const colors = getColors()

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-200 ${
          isAnimating && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
          isAnimating && !isClosing 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                <AlertTriangle className={`w-8 h-8 ${colors.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#2c3e50] text-center mb-3">
              {title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center leading-relaxed mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3 ${colors.confirmBg} ${colors.confirmHover} text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

