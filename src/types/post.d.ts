export interface Post {
  id: string
  title: string
  body: string
  excerpt: string
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  title: string
  body: string
}

export interface UpdatePostData {
  title?: string
  body?: string
}
