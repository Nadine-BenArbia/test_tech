import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicLayout } from "@/layouts/PublicLayout"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12 animate-fade-in">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-bounce-in">
          <FileQuestion className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 animate-pulse-slow" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slide-in-left">
          404
        </h1>

        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 animate-scale-in"></div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 animate-slide-in-right">Page Not Found</h2>

        <p className="text-gray-600 max-w-md mb-8 leading-relaxed animate-slide-up">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-1">
          <Button asChild size="lg" className="btn-animate">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="hover-lift">
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}
