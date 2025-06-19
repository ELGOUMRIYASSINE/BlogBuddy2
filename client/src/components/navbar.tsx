import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">ModernBlog</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#categories" className="text-gray-600 hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
            <Link href="/admin">
              <Button className="bg-secondary text-white hover:bg-indigo-700">
                Admin
              </Button>
            </Link>
          </div>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#categories" className="block py-2 text-gray-600 hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#about" className="block py-2 text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="block py-2 text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
            <Link href="/admin" className="block py-2">
              <Button className="bg-secondary text-white hover:bg-indigo-700 w-full">
                Admin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
