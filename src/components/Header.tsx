'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { Badge } from '@/components/ui/badge'

export default function Header() {
  const { data: session } = useSession()
  const itemCount = useCart((state) => state.getItemCount())

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <span className="text-primary">🍔</span>
            <span className="ml-2">Highway Burger</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">Anasayfa</Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {session ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Çıkış Yap"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="default">
                <User className="mr-2 h-4 w-4" />
                Giriş Yap
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

