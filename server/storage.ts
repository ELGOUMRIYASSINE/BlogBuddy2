import { users, posts, categories, type User, type InsertUser, type Post, type InsertPost, type Category, type InsertCategory } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Post methods
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostsByCategory(category: string): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  getPopularPosts(limit?: number): Promise<Post[]>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryPostCount(categoryName: string, increment: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private categories: Map<number, Category>;
  private currentUserId: number;
  private currentPostId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.categories = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentCategoryId = 1;

    // Initialize with default admin user
    this.createUser({ username: "admin", password: process.env.ADMIN_PASSWORD || "admin123" });

    // Initialize default categories
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const defaultCategories = ["Technology", "Lifestyle", "Design", "Business"];
    for (const categoryName of defaultCategories) {
      await this.createCategory({ name: categoryName });
    }

    // Add sample blog posts
    const samplePosts = [
      {
        title: "The Future of Web Development in 2025",
        excerpt: "Exploring the latest trends and technologies that will shape web development in the coming year.",
        content: "Web development continues to evolve at a rapid pace. In 2025, we're seeing exciting developments in AI-powered development tools, serverless architectures, and new JavaScript frameworks.\n\nThe rise of AI assistants in coding has transformed how developers approach problem-solving. These tools can generate code snippets, debug issues, and even suggest architectural improvements.\n\nServerless computing has matured significantly, offering developers the ability to build scalable applications without managing infrastructure. This shift allows teams to focus more on business logic and user experience.\n\nNew frameworks continue to emerge, each addressing specific pain points in modern development. The emphasis is on developer experience, performance, and maintainability.",
        author: "Alex Johnson",
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
        published: true
      },
      {
        title: "Building Healthy Work-Life Balance as a Remote Developer",
        excerpt: "Practical tips for maintaining productivity and well-being while working from home.",
        content: "Remote work has become the norm for many developers, but it comes with unique challenges. Maintaining a healthy work-life balance requires intentional strategies and boundaries.\n\nCreating a dedicated workspace helps establish mental boundaries between work and personal time. Even in small apartments, having a specific area for work can make a significant difference.\n\nEstablishing regular hours and sticking to them prevents work from bleeding into personal time. It's tempting to 'just fix one more bug' but this can lead to burnout.\n\nTaking regular breaks, exercising, and maintaining social connections are crucial for long-term success and happiness in remote work environments.",
        author: "Sarah Chen",
        category: "Lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        published: true
      },
      {
        title: "Modern UI Design Principles for 2025",
        excerpt: "Key design principles and trends that are shaping user interface design this year.",
        content: "User interface design continues to evolve, with 2025 bringing fresh perspectives on usability, accessibility, and aesthetic appeal.\n\nMinimalism remains strong, but with more emphasis on meaningful interactions and micro-animations that guide users through interfaces. The goal is to create experiences that feel both simple and engaging.\n\nAccessibility is no longer an afterthought but a core design principle. Designers are creating interfaces that work for users with diverse abilities and needs from the ground up.\n\nColor psychology and typography are being used more strategically to create emotional connections with users while maintaining excellent readability and usability across all devices.",
        author: "Maria Rodriguez",
        category: "Design",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
        published: true
      },
      {
        title: "Scaling Your Tech Startup: Lessons from the Trenches",
        excerpt: "Real-world insights on growing a technology startup from MVP to market leader.",
        content: "Scaling a tech startup requires more than just great code – it demands strategic thinking, team building, and careful resource management.\n\nThe journey from MVP to product-market fit is often longer than anticipated. It's crucial to stay close to your customers and iterate based on real feedback rather than assumptions.\n\nBuilding the right team at the right time is critical. Hiring too fast can strain resources, while hiring too slow can limit growth opportunities. Focus on finding people who align with your company values and can grow with the organization.\n\nTechnical debt becomes a real challenge as you scale. Investing in proper architecture and development practices early on saves significant time and resources later in the journey.",
        author: "David Kim",
        category: "Business",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
        published: true
      }
    ];

    for (const postData of samplePosts) {
      await this.createPost(postData);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const slug = this.generateSlug(insertPost.title);
    const now = new Date();
    
    const post: Post = {
      id,
      title: insertPost.title,
      slug,
      excerpt: insertPost.excerpt,
      content: insertPost.content,
      author: insertPost.author,
      category: insertPost.category,
      imageUrl: insertPost.imageUrl || null,
      published: insertPost.published !== undefined ? insertPost.published : true,
      createdAt: now,
      updatedAt: now,
    };
    
    this.posts.set(id, post);
    await this.updateCategoryPostCount(post.category, 1);
    return post;
  }

  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;

    const updatedPost: Post = {
      ...existingPost,
      ...updateData,
      slug: updateData.title ? this.generateSlug(updateData.title) : existingPost.slug,
      updatedAt: new Date(),
    };

    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post) return false;

    this.posts.delete(id);
    await this.updateCategoryPostCount(post.category, -1);
    return true;
  }

  async getPopularPosts(limit: number = 3): Promise<Post[]> {
    // For MVP, just return the most recent posts as "popular"
    const allPosts = await this.getAllPosts();
    return allPosts.slice(0, limit);
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = {
      ...insertCategory,
      id,
      postCount: 0,
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategoryPostCount(categoryName: string, increment: number): Promise<void> {
    const category = Array.from(this.categories.values()).find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (category) {
      category.postCount = Math.max(0, category.postCount + increment);
      this.categories.set(category.id, category);
    }
  }
}

export const storage = new MemStorage();
