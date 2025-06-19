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
    this.createUser({ username: "admin", password: "admin123" });

    // Initialize default categories
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const defaultCategories = ["Technology", "Lifestyle", "Design", "Business"];
    for (const categoryName of defaultCategories) {
      await this.createCategory({ name: categoryName });
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
      ...insertPost,
      id,
      slug,
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
