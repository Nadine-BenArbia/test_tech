import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PostCardSkeleton() {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-white to-gray-50/50 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-3 w-3 rounded-full animate-shimmer" />
          <div className="h-3 w-20 animate-shimmer rounded" />
          <div className="h-3 w-3 rounded-full ml-2 animate-shimmer" />
          <div className="h-3 w-16 animate-shimmer rounded" />
        </div>
        <div className="h-6 w-full mb-2 animate-shimmer rounded" />
        <div className="h-6 w-3/4 animate-shimmer rounded" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full animate-shimmer rounded" />
          <div className="h-4 w-full animate-shimmer rounded" />
          <div className="h-4 w-2/3 animate-shimmer rounded" />
        </div>
        <div className="flex items-center">
          <div className="h-4 w-20 animate-shimmer rounded" />
          <div className="h-4 w-4 ml-1 animate-shimmer rounded" />
        </div>
      </CardContent>
    </Card>
  )
}
