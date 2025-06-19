import { Link } from "wouter";
import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  Technology: "bg-secondary text-white",
  Lifestyle: "bg-accent text-white", 
  Design: "bg-purple-500 text-white",
  Business: "bg-orange-500 text-white",
};

const getReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

export default function PostCard({ post, featured = false }: PostCardProps) {
  const categoryColor = categoryColors[post.category] || "bg-gray-500 text-white";
  const readingTime = getReadingTime(post.content);

  if (featured) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-64 object-cover" 
          />
        )}
        <div className="p-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={categoryColor}>{post.category}</Badge>
            <span className="text-gray-500 text-sm">{readingTime}</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-primary">{post.title}</h2>
          <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-500 text-sm">
                  {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <Link href={`/post/${post.slug}`}>
              <button className="text-secondary hover:text-indigo-700 font-semibold">
                Read More →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-48 object-cover" 
        />
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`${categoryColor} text-xs font-medium`}>{post.category}</Badge>
          <span className="text-gray-500 text-sm">{readingTime}</span>
        </div>
        <Link href={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-3 text-primary hover:text-secondary cursor-pointer transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="font-medium text-sm">{post.author}</p>
            <p className="text-gray-500 text-xs">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
