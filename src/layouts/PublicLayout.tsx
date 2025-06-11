import type React from "react"
import Link from "next/link"
import { BookOpen, Settings } from "lucide-react"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover-scale animate-slide-in-left"
            >
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="hidden xs:inline">Blog</span>
             
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover-lift animate-slide-in-right"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:py-8 animate-fade-in">{children}</main>
    </div>
  )
}
