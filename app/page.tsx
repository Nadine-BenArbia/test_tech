"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { postService, type PaginatedResult } from "@/services/postService"
import { PostCard } from "@/components/PostCard"
import { PostCardSkeleton } from "@/components/PostCardSkeleton"
import { PaginationControls } from "@/components/PaginationControls"
import { PublicLayout } from "@/layouts/PublicLayout"
import { Sparkles, TrendingUp } from "lucide-react"
import type { Post } from "@/types/post"

function PostsGrid() {
  const [postsData, setPostsData] = useState<PaginatedResult<Post> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  useEffect(() => {
    loadPosts(currentPage)
  }, [currentPage])

  const loadPosts = async (page: number) => {
    setIsLoading(true)
    try {
      const result = await postService.getAllPosts(page, 9) 
      setPostsData(result)
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }

    const newUrl = params.toString() ? `/?${params.toString()}` : "/"
    router.push(newUrl)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!postsData || postsData.data.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 animate-fade-in">
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-bounce-in">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 animate-pulse-slow" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 animate-slide-up">No posts available yet</h3>
        <p className="text-sm sm:text-base text-gray-600 animate-slide-up">Check back soon for amazing content!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {postsData.data.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Pagination */}
      <div className="animate-fade-in">
        <PaginationControls
          currentPage={postsData.currentPage}
          totalPages={postsData.totalPages}
          onPageChange={handlePageChange}
          className="mt-8 sm:mt-12"
        />
      </div>

     
    </div>
  )
}

function PostsGridSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="space-y-8 sm:space-y-12 page-transition">
        {/* Hero Section */}
        <div className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-bounce-in">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            <span>Trending Stories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight animate-slide-down">
            Discover Amazing
            <br />
            <span className="relative animate-slide-up">
              Stories
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-scale-in"></div>
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 animate-fade-in">
            Explore our collection of insightful articles, tutorials, and stories crafted by passionate writers from
            around the world.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-4 sm:gap-8 mt-6 sm:mt-8">
            <div className="text-center animate-slide-in-left">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 hover-scale">100+</div>
              <div className="text-xs sm:text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center animate-fade-in animate-stagger-1">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 hover-scale">50K+</div>
              <div className="text-xs sm:text-sm text-gray-600">Readers</div>
            </div>
            <div className="text-center animate-slide-in-right">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 hover-scale">25+</div>
              <div className="text-xs sm:text-sm text-gray-600">Writers</div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <div className="flex items-center gap-3 mb-6 sm:mb-8 animate-slide-in-left">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full animate-float"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest Posts</h2>
          </div>

          <Suspense fallback={<PostsGridSkeleton />}>
            <PostsGrid />
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  )
}
