import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPostSchema, type Post, type InsertPost } from "@shared/schema";

interface PostFormProps {
  postId?: number | null;
  onSave: () => void;
}

const categories = ["Technology", "Lifestyle", "Design", "Business"];

export default function PostForm({ postId, onSave }: PostFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!postId;

  const { data: post } = useQuery<Post>({
    queryKey: [`/api/posts/${postId}`],
    enabled: isEditing,
  });

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "Technology",
      imageUrl: "",
      published: true,
    },
  });

  useEffect(() => {
    if (post && isEditing) {
      form.reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        imageUrl: post.imageUrl || "",
        published: post.published,
      });
    }
  }, [post, isEditing, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/admin/posts/${postId}`, data);
      } else {
        await apiRequest("POST", "/api/admin/posts", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: `The post has been successfully ${isEditing ? "updated" : "created"}.`,
      });
      onSave();
    },
    onError: (error: any) => {
      toast({
        title: `${isEditing ? "Update" : "Create"} failed`,
        description: error.message || `Failed to ${isEditing ? "update" : "create"} post`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPost) => {
    saveMutation.mutate(data);
  };

  return (
    <Card>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the post"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here..."
                      rows={12}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={onSave}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-accent text-white hover:bg-emerald-600"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Post" : "Create Post")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
