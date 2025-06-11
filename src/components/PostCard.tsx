import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Post } from "@/types/post"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface PostCardProps {
  post: Post
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Link href={`/posts/${post.id}`} className="group">
      <Card
        className={`h-full card-hover cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 hover:from-blue-50/50 hover:to-purple-50/50 animate-fade-in animate-stagger-${Math.min(index + 1, 4)}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 animate-slide-in-left">
            <Calendar className="w-3 h-3 animate-pulse-slow" />
            <span>{formatDate(post.createdAt)}</span>
            <Clock className="w-3 h-3 ml-2" />
            <span>5 min read</span>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 animate-slide-in-right">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed animate-fade-in">{post.excerpt}</p>
          <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700 animate-slide-up">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
