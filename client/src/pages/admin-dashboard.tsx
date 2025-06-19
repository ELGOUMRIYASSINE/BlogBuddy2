import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import PostsTable from "@/components/admin/posts-table";
import PostForm from "@/components/admin/post-form";

type View = "posts" | "create" | "edit";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<View>("posts");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const { data: authStatus, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: authService.getMe,
  });

  useEffect(() => {
    if (!isLoading && !authStatus?.isAuthenticated) {
      setLocation("/admin");
    }
  }, [authStatus, isLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (postId: number) => {
    setEditingPostId(postId);
    setCurrentView("edit");
  };

  const handlePostSaved = () => {
    setCurrentView("posts");
    setEditingPostId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authStatus?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white p-6">
          <div className="flex items-center space-x-2 mb-8">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>
          <nav className="space-y-2">
            <Button
              variant={currentView === "posts" ? "secondary" : "ghost"}
              className={`w-full text-left justify-start ${
                currentView === "posts" 
                  ? "bg-secondary hover:bg-indigo-700" 
                  : "text-white hover:bg-gray-700"
              }`}
              onClick={() => setCurrentView("posts")}
            >
              All Posts
            </Button>
            <Button
              variant={currentView === "create" ? "secondary" : "ghost"}
              className={`w-full text-left justify-start ${
                currentView === "create" 
                  ? "bg-secondary hover:bg-indigo-700" 
                  : "text-white hover:bg-gray-700"
              }`}
              onClick={() => setCurrentView("create")}
            >
              Create Post
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left justify-start text-white hover:bg-gray-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {currentView === "posts" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">All Posts</h1>
                <Button 
                  className="bg-accent text-white hover:bg-emerald-600"
                  onClick={() => setCurrentView("create")}
                >
                  New Post
                </Button>
              </div>
              <PostsTable onEditPost={handleEditPost} />
            </div>
          )}

          {(currentView === "create" || currentView === "edit") && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">
                  {currentView === "create" ? "Create New Post" : "Edit Post"}
                </h1>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView("posts")}
                >
                  ← Back to Posts
                </Button>
              </div>
              <PostForm 
                postId={currentView === "edit" ? editingPostId : null}
                onSave={handlePostSaved}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
