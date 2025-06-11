"use client";

import { DialogFooter } from "@/components/ui/dialog";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postService, type PaginatedResult } from "@/services/postService";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { PaginationControls } from "@/components/PaginationControls";
import { useToast } from "@/hooks/useToast";
import type { Post, CreatePostData } from "@/types/post";
import {
  Plus,
  Edit,
  Eye,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [postsData, setPostsData] = useState<PaginatedResult<Post> | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<CreatePostData>({
    title: "",
    body: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number.parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    loadPosts(currentPage);
    loadTotalCount();
  }, [currentPage]);

  const loadPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await postService.getAdminPosts(page, 10);
      setPostsData(result);
    } catch (error) {
      console.error("Failed to load posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTotalCount = async () => {
    try {
      const count = await postService.getTotalCount();
      setTotalCount(count);
    } catch (error) {
      console.error("Failed to load total count:", error);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const newUrl = params.toString() ? `/admin?${params.toString()}` : "/admin";
    router.push(newUrl);
  };

  const handleCreatePost = async () => {
    console.log("=== CREATE POST FUNCTION CALLED ===");
    console.log("Form data:", formData);

    if (!formData.title.trim()) {
      console.log("Validation failed: No title");
      toast({
        title: "Validation Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.body.trim()) {
      console.log("Validation failed: No content");
      toast({
        title: "Validation Error",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Calling postService.createPost with:", formData);
      const newPost = await postService.createPost(formData);
      console.log("Post created successfully:", newPost);

      setFormData({ title: "", body: "" });
      setIsCreateDialogOpen(false);

      await loadPosts(1);
      await loadTotalCount();

      if (currentPage !== 1) {
        console.log("Navigating to first page...");
        router.push("/admin");
      }

      console.log("Showing success toast...");
      toast({
        title: "Success!",
        description: "Post created successfully.",
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log("=== CREATE POST FUNCTION COMPLETED ===");
    }
  };

  const handleEditPost = async () => {
    if (!editingPost) return;

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.body.trim()) {
      toast({
        title: "Validation Error",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedPost = await postService.updatePost(
        editingPost.id,
        formData
      );
      if (updatedPost && postsData) {
        const updatedData = {
          ...postsData,
          data: postsData.data.map((post) =>
            post.id === editingPost.id ? updatedPost : post
          ),
        };
        setPostsData(updatedData);
        setFormData({ title: "", body: "" });
        setIsEditDialogOpen(false);
        setEditingPost(null);
        toast({
          title: "Success!",
          description: "Post updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    console.log("=== DELETE POST FUNCTION CALLED ===");
    console.log("Post ID to delete:", id);

    setDeletingPostId(id);
    try {
      const success = await postService.deletePost(id);
      if (success) {
        console.log("Delete was successful, reloading data...");

        const newTotalCount = await postService.getTotalCount();
        const newTotalPages = Math.ceil(newTotalCount / 10);

        let pageToLoad = currentPage;
        if (currentPage > newTotalPages && newTotalPages > 0) {
          pageToLoad = newTotalPages;

          const params = new URLSearchParams();
          if (pageToLoad > 1) {
            params.set("page", pageToLoad.toString());
          }
          const newUrl = params.toString()
            ? `/admin?${params.toString()}`
            : "/admin";
          router.push(newUrl);
        }

        await loadPosts(pageToLoad);
        await loadTotalCount();

        toast({
          title: "Success!",
          description: "Post deleted successfully.",
        });
      } else {
        console.log("Delete failed - post not found");
        toast({
          title: "Error",
          description: "Failed to delete post. Post not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPostId(null);
      setDeleteDialogOpen(null);
    }
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({ title: post.title, body: post.body });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: "", body: "" });
    setEditingPost(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 page-transition">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="h-8 sm:h-9 w-48 animate-shimmer rounded" />
            <div className="h-9 sm:h-10 w-32 animate-shimmer rounded" />
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 w-16 animate-shimmer rounded" />
                  <div className="h-6 sm:h-8 w-20 animate-shimmer rounded" />
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="grid gap-3 sm:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 sm:h-6 w-3/4 animate-shimmer rounded" />
                  <div className="h-4 w-1/2 animate-shimmer rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full mb-2 animate-shimmer rounded" />
                  <div className="h-4 w-2/3 animate-shimmer rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 page-transition">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 animate-slide-down">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto btn-animate animate-slide-in-right"
                onClick={() => {
                  console.log("Create Post button clicked");
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-4xl max-w-xs max-h-[90vh] overflow-y-auto mx-4 animate-scale-in">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post with title and content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-slide-up">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter an engaging post title"
                    className="mt-1"
                  />
                </div>
                <div className="animate-slide-up animate-stagger-1">
                  <Label htmlFor="body">Content *</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      value={formData.body}
                      onChange={(value) =>
                        setFormData({ ...formData, body: value })
                      }
                      placeholder="Write your post content here..."
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 animate-slide-up">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Create Post form submit button clicked");
                    handleCreatePost();
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-animate"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts  */}
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 animate-slide-in-right">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Posts Management
              </h2>
              <p className="text-sm sm:text-base text-gray-600 animate-slide-in-left animate-stagger-1">
                Manage your blog posts and content
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 animate-bounce-in">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              <span>Data loaded from JSONPlaceholder API</span>
            </div>
          </div>

          {!postsData || postsData.data.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse-slow" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 animate-slide-up">
                  No posts found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center animate-slide-up animate-stagger-1">
                  Create your first post to get started
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto btn-animate animate-slide-up animate-stagger-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4">
                {postsData.data.map((post, index) => (
                  <Card
                    key={post.id}
                    className={`hover:shadow-md transition-shadow duration-200 card-hover animate-slide-up animate-stagger-${Math.min(
                      index + 1,
                      4
                    )}`}
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 text-gray-900 mb-1 text-sm sm:text-base">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-gray-600">
                            Created: {formatDate(post.createdAt)}
                            {post.updatedAt !== post.createdAt && (
                              <span>
                                {" "}
                                • Updated: {formatDate(post.updatedAt)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600 hover-scale"
                          >
                            <Link href={`/posts/${post.id}`}>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                            className="text-gray-600 hover:text-blue-600 hover-scale"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>

                          {/* Inline Delete Dialog */}
                          <Dialog
                            open={deleteDialogOpen === post.id}
                            onOpenChange={(open) =>
                              setDeleteDialogOpen(open ? post.id : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 hover:text-red-600 hover:border-red-300 hover-scale"
                                onClick={() => {
                                  console.log(
                                    "Delete button clicked for post:",
                                    post.id,
                                    post.title
                                  );
                                  setDeleteDialogOpen(post.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md animate-scale-in">
                              <DialogHeader>
                                <div className="flex items-center gap-3 animate-slide-in-left">
                                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-bounce-in">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                  </div>
                                  <div className="flex-1">
                                    <DialogTitle className="text-left animate-slide-up">
                                      Delete Post
                                    </DialogTitle>
                                  </div>
                                </div>
                                <DialogDescription className="text-left mt-2 animate-fade-in">
                                  Are you sure you want to delete{" "}
                                  <strong>"{post.title}"</strong>?
                                  <span className="block mt-2 text-sm text-gray-600">
                                    This will permanently remove the post from
                                    your blog.
                                  </span>
                                  <span className="block mt-2 text-sm font-medium text-red-600 ">
                                    This action cannot be undone.
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2 sm:gap-0 animate-slide-up">
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteDialogOpen(null)}
                                  disabled={deletingPostId === post.id}
                                  className="hover-scale"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    console.log(
                                      "Confirm delete clicked for post:",
                                      post.id
                                    );
                                    handleDeletePost(post.id);
                                  }}
                                  disabled={deletingPostId === post.id}
                                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600 btn-animate"
                                >
                                  {deletingPostId === post.id ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Post
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="animate-fade-in">
                <PaginationControls
                  currentPage={postsData.currentPage}
                  totalPages={postsData.totalPages}
                  onPageChange={handlePageChange}
                  className="mt-6 sm:mt-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="lg:max-w-4xl max-w-xs max-h-[90vh] overflow-y-auto mx-4 animate-scale-in">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Update the post title and content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="animate-slide-up">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter an engaging post title"
                  className="mt-1"
                />
              </div>
              <div className="animate-slide-up animate-stagger-1">
                <Label htmlFor="edit-body">Content *</Label>
                <div className="mt-1">
                  <RichTextEditor
                    value={formData.body}
                    onChange={(value) =>
                      setFormData({ ...formData, body: value })
                    }
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 animate-slide-up">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPost}
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-animate"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
