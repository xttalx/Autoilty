import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop)'
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/90"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover the Best Auto Detailing Resources and Tips
          </h1>
          <p className="text-xl mb-8">Your comprehensive guide to automotive care, products, and professional services</p>
          <Link
            to="/marketplace"
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-block"
          >
            Shop Marketplace
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Featured Products Section */}
              <section className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                  <p className="text-gray-600">Top-rated automotive detailing products and supplies</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">Product {item}</h3>
                        <p className="text-sm text-gray-600 mb-2">Premium automotive detailing product</p>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-500">★★★★☆</span>
                          <Link to="/marketplace" className="text-primary hover:underline">
                            View More →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Detailing Tips Section */}
              <section className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Detailing Tips</h2>
                  <p className="text-gray-600">Expert guides and tutorials for professional results</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">Tip {item}</h3>
                        <p className="text-sm text-gray-600">Expert automotive detailing advice</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Popular Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/marketplace" className="text-gray-700 hover:text-primary transition">Best Car Wax 2024</Link></li>
                  <li><Link to="/marketplace" className="text-gray-700 hover:text-primary transition">How to Remove Swirl Marks</Link></li>
                  <li><Link to="/marketplace" className="text-gray-700 hover:text-primary transition">Ceramic Coating vs Wax</Link></li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">Get the latest tips and product reviews.</p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

