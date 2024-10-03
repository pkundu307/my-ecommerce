import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p className="text-gray-400">
            We are a leading e-commerce platform providing a wide range of products to customers worldwide.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul>
            <li className="mb-2"><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
            <li className="mb-2"><a href="/shop" className="text-gray-400 hover:text-white">Shop</a></li>
            <li className="mb-2"><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
            <li className="mb-2"><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400">Email: support@example.com</p>
          <p className="text-gray-400">Phone: +1 (234) 567-890</p>
          <div className="flex mt-4">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.675 0h-21.35C.598 0 0 .598 0 1.326v21.348C0 23.402.598 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.762v2.31h3.588l-.467 3.622h-3.121V24h6.116c.728 0 1.326-.598 1.326-1.326V1.326C24 .598 23.402 0 22.675 0z"
                />
              </svg>
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M24 4.557a9.905 9.905 0 01-2.828.775 4.93 4.93 0 002.165-2.724 9.855 9.855 0 01-3.127 1.196 4.924 4.924 0 00-8.391 4.49A13.976 13.976 0 011.671 3.149a4.923 4.923 0 001.523 6.573 4.903 4.903 0 01-2.229-.616v.062a4.926 4.926 0 003.95 4.827 4.995 4.995 0 01-2.224.085 4.928 4.928 0 004.604 3.417A9.867 9.867 0 010 19.54 13.905 13.905 0 007.548 22c9.142 0 14.307-7.721 13.995-14.646a10.002 10.002 0 002.457-2.797z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-8 text-gray-500">
        &copy; 2024 My E-commerce Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
