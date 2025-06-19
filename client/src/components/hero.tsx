import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToMain = () => {
    const mainContent = document.querySelector('main');
    mainContent?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="primary-gradient text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Share Your Story</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover insights on technology, creativity, and life from our community of writers.
        </p>
        <Button 
          onClick={scrollToMain}
          className="bg-accent text-white px-8 py-3 text-lg font-semibold hover:bg-emerald-600"
        >
          Start Reading
        </Button>
      </div>
    </section>
  );
}
