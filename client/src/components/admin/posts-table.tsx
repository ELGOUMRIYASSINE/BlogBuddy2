import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Post } from "@shared/schema";
import { format } from "date-fns";
import { Trash2, Edit3 } from "lucide-react";

interface PostsTableProps {
  onEditPost: (postId: number) => void;
}

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-800",
  Lifestyle: "bg-green-100 text-green-800", 
  Design: "bg-purple-100 text-purple-800",
  Business: "bg-orange-100 text-orange-800",
};

export default function PostsTable({ onEditPost }: PostsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("DELETE", `/api/admin/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (postId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(postId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
        <p className="text-gray-500">Create your first blog post to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const categoryColor = categoryColors[post.category] || "bg-gray-100 text-gray-800";
            
            return (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{post.title}</div>
                </TableCell>
                <TableCell>
                  <Badge className={categoryColor}>{post.category}</Badge>
                </TableCell>
                <TableCell className="text-gray-900">{post.author}</TableCell>
                <TableCell className="text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPost(post.id)}
                      className="text-secondary hover:text-indigo-900"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
