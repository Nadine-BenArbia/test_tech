import type { Post, CreatePostData, UpdatePostData } from "@/types/post"

const API_BASE_URL = "https://jsonplaceholder.typicode.com"
const STORAGE_KEY = "blogPosts"


let localPosts: Post[] = []
let isInitialized = false


export interface PaginatedResult<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}


function generateExcerpt(text: string, maxLength = 150): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

// Transform JSONPlaceholder post to  Post interface
function transformPost(apiPost: any): Post {
  return {
    id: apiPost.id.toString(),
    title: apiPost.title,
    body: `<p>${apiPost.body.split("\n").join("</p><p>")}</p>`,
    excerpt: generateExcerpt(apiPost.body),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
  }
}

// Save posts to localStorage
function savePosts() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localPosts))
      console.log("Saved posts to localStorage:", localPosts.length)
    } catch (error) {
      console.error("Failed to save posts to localStorage:", error)
    }
  }
}

// Load posts from localStorage
function loadPosts(): Post[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const posts = JSON.parse(stored)
        console.log("Loaded posts from localStorage:", posts.length)
        return posts
      }
    } catch (error) {
      console.error("Failed to load posts from localStorage:", error)
    }
  }
  return []
}

// Initialize posts from localStorage or JSONPlaceholder
async function initializePosts() {
  if (isInitialized) return

  try {
   
    const storedPosts = loadPosts()

    if (storedPosts.length > 0) {
      localPosts = storedPosts
      isInitialized = true
      console.log("Using stored posts:", localPosts.length)
      return
    }

    // If no stored posts, fetch from API
    console.log("No stored posts found, fetching from JSONPlaceholder API...")
    const response = await fetch(`${API_BASE_URL}/posts`)
    if (response.ok) {
      const apiPosts = await response.json()
      localPosts = apiPosts.map(transformPost)

      savePosts()
      isInitialized = true
      console.log("Loaded and saved API posts:", localPosts.length)
    }
  } catch (error) {
    console.error("Failed to initialize posts:", error)
    localPosts = []
    isInitialized = true
  }
}

// Paginate array
function paginateArray<T>(array: T[], page: number, itemsPerPage: number): PaginatedResult<T> {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const data = array.slice(startIndex, endIndex)

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(array.length / itemsPerPage),
    totalItems: array.length,
    itemsPerPage,
  }
}

export const postService = {
  getAllPosts: async (page = 1, itemsPerPage = 9): Promise<PaginatedResult<Post>> => {
    await initializePosts()
    console.log("Getting all posts. Total posts:", localPosts.length)
    const sortedPosts = [...localPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return paginateArray(sortedPosts, page, itemsPerPage)
  },

  getAdminPosts: async (page = 1, itemsPerPage = 10): Promise<PaginatedResult<Post>> => {
    await initializePosts()
    console.log("Getting admin posts. Total posts:", localPosts.length)
    const sortedPosts = [...localPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return paginateArray(sortedPosts, page, itemsPerPage)
  },

  getPostById: async (id: string): Promise<Post | null> => {
    await initializePosts()
    console.log("Looking for post with ID:", id)
    const post = localPosts.find((post) => post.id === id)
    console.log("Found post:", post ? post.title : "Not found")
    return post || null
  },

  createPost: async (data: CreatePostData): Promise<Post> => {
    await initializePosts()

    const maxId = Math.max(...localPosts.map((p) => Number.parseInt(p.id) || 0), 0)
    const newId = (maxId + 1).toString()

    const newPost: Post = {
      id: newId,
      title: data.title,
      body: data.body,
      excerpt: generateExcerpt(data.body.replace(/<[^>]*>/g, "")),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    localPosts.unshift(newPost)

    savePosts()

    console.log("Created new post:", newPost)
    console.log("Total posts after creation:", localPosts.length)

    return newPost
  },

  updatePost: async (id: string, data: UpdatePostData): Promise<Post | null> => {
    await initializePosts()

    const postIndex = localPosts.findIndex((post) => post.id === id)
    if (postIndex === -1) {
      console.log("Post not found for update:", id)
      return null
    }

    const updatedPost: Post = {
      ...localPosts[postIndex],
      ...data,
      excerpt: data.body ? generateExcerpt(data.body.replace(/<[^>]*>/g, "")) : localPosts[postIndex].excerpt,
      updatedAt: new Date().toISOString(),
    }

    localPosts[postIndex] = updatedPost

    savePosts()

    console.log("Updated post:", updatedPost)
    return updatedPost
  },

  deletePost: async (id: string): Promise<boolean> => {
    await initializePosts()

    const postIndex = localPosts.findIndex((post) => post.id === id)
    console.log("Deleting post with ID:", id, "Found at index:", postIndex)

    if (postIndex === -1) {
      console.log("Post not found for deletion")
      return false
    }

    localPosts.splice(postIndex, 1)

    // Save to localStorage
    savePosts()

    console.log("Post deleted successfully. Remaining posts:", localPosts.length)
    return true
  },

  getTotalCount: async (): Promise<number> => {
    await initializePosts()
    return localPosts.length
  },

  clearAllPosts: async (): Promise<void> => {
    localPosts = []
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    console.log("Cleared all posts")
  },

  resetToApiPosts: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    isInitialized = false
    localPosts = []
    await initializePosts()
    console.log("Reset to API posts")
  },
}
