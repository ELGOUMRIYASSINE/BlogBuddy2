import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Post } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { search: searchQuery, category: categoryFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);
      
      const response = await fetch(`/api/posts?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCategoryFilter(""); // Clear category filter when searching
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setSearchQuery(""); // Clear search when filtering by category
  };

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 5) || [];

  return (
    <>
      <Navbar />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1">
            {isLoading ? (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                  <Skeleton className="w-full h-64" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <div className="p-6 space-y-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-600 mb-4">No posts found</h2>
                <p className="text-gray-500">
                  {searchQuery ? `No posts match "${searchQuery}"` : 
                   categoryFilter ? `No posts in "${categoryFilter}" category` : 
                   "No posts available yet"}
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && <PostCard post={featuredPost} featured />}

                {/* Recent Posts Grid */}
                {recentPosts.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-primary">Recent Posts</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {recentPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Load More Button - placeholder for pagination */}
                {posts && posts.length > 5 && (
                  <div className="text-center">
                    <Button className="bg-primary text-white px-8 py-3 hover:bg-gray-800">
                      Load More Posts
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>

          <Sidebar onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />
        </div>
      </div>

      <Footer />
    </>
  );
}
