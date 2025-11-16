import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Autoilty</h4>
            <p className="text-gray-400">
              Your trusted source for automotive detailing resources, products, and professional services.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/marketplace" className="hover:text-white transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Product Reviews
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  How-To Guides
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@autoilty.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Autoilty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

