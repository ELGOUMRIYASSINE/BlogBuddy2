import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { type Post } from "@shared/schema";
import { format } from "date-fns";

const categoryColors: Record<string, string> = {
  Technology: "bg-secondary text-white",
  Lifestyle: "bg-accent text-white", 
  Design: "bg-purple-500 text-white",
  Business: "bg-orange-500 text-white",
};

export default function PostPage() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-full h-64" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Post not found</h1>
            <p className="text-gray-500 mb-8">The post you're looking for doesn't exist.</p>
            <Link href="/">
              <button className="inline-flex items-center space-x-2 text-secondary hover:text-indigo-700 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const categoryColor = categoryColors[post.category] || "bg-gray-500 text-white";

  return (
    <>
      <head>
        <title>{post.title} | ModernBlog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl || ""} />
        <meta property="og:type" content="article" />
      </head>
      
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <button className="inline-flex items-center space-x-2 text-secondary hover:text-indigo-700 font-semibold mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </Link>

        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={categoryColor}>{post.category}</Badge>
            <span className="text-gray-500 text-sm">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold text-lg">{post.author}</p>
              <p className="text-gray-500">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </header>

        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl mb-8" 
          />
        )}

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ) : null
          ))}
        </div>
      </article>

      <Footer />
    </>
  );
}
