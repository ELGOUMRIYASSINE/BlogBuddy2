import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { type Post, type Category } from "@shared/schema";
import { format } from "date-fns";

interface SidebarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
}

export default function Sidebar({ onSearch, onCategoryFilter }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: popularPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts/popular"],
  });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <aside className="lg:w-80">
      {/* Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => onCategoryFilter(category.name)}
              >
                <span>{category.name}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {category.postCount}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AdSense Placeholder */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-8">
        <div className="text-gray-400 mb-2">
          <ExternalLink className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-sm text-gray-500">Advertisement</p>
      </div>

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">Popular Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts?.map((post) => (
              <div key={post.id} className="flex space-x-3">
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-16 h-12 object-cover rounded-lg" 
                  />
                )}
                <div className="flex-1">
                  <Link href={`/post/${post.slug}`}>
                    <h4 className="font-medium text-sm text-primary hover:text-secondary cursor-pointer transition-colors">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
