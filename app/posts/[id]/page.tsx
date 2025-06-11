"use client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { postService } from "@/services/postService"
import { PostDetails } from "@/components/PostDetails"
import { PublicLayout } from "@/layouts/PublicLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params

  try {
    const post = await postService.getPostById(id)

    if (!post) {
      notFound()
    }

    return (
      <PublicLayout>
        <div className="space-y-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </Button>

          <PostDetails post={post} />
        </div>
      </PublicLayout>
    )
  } catch (error) {
    console.error("Error fetching post:", error)
    notFound()
  }
}
