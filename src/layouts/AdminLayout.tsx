import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Sparkles } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-900 hover-scale animate-slide-in-left"
              >
               
                <span className="inline lg:text-2xl text-sm">Admin Dashboard</span>
               
              </Link>
             
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm  hover-lift animate-slide-in-right"
              >
                <Link href="/" className="flex items-center gap-1 sm:gap-2">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View Site</span>
                  <span className="sm:hidden">Site</span>
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:py-8 animate-fade-in">{children}</main>
    </div>
  )
}
