import type { Post } from "@/types/post"

interface PostDetailsProps {
  post: Post
}

export function PostDetails({ post }: PostDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <article className="max-w-4xl mx-auto page-transition">
      <header className="mb-8 animate-slide-down">
        <h1 className="text-4xl font-bold mb-4 animate-slide-in-left">{post.title}</h1>
        <div className="text-muted-foreground animate-slide-in-right">
          <p>Published on {formatDate(post.createdAt)}</p>
          {post.updatedAt !== post.createdAt && <p>Updated on {formatDate(post.updatedAt)}</p>}
        </div>
      </header>

      
      <div
        className="prose prose-lg max-w-none animate-fade-in rich-text-content"
        dangerouslySetInnerHTML={{ __html: post.body }}
        style={{
          lineHeight: "1.6",
          fontSize: "16px",
          color: "#374151",
        }}
      />
    </article>
  )
}
