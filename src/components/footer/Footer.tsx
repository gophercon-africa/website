import React from 'react';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-8 md:mb-0">
            <Image 
              src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744891071/GopherCon_Africa_25_vskz7n_obmh5q.png" 
              alt="GopherCon Africa Logo" 
              className="h-12 w-auto"
              width={160}
              height={160}
            />
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://x.com/gophers_africa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-[#1DA1F2] transition-colors"
            >
               <Image 
                src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744803296/X_logo_2023.svg_s6irtp.png" 
                alt="Meetup Logo" 
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
              />
            </a>
            <a 
              href="https://www.meetup.com/golangnigeria/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <Image 
                src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744802510/meetup-logo_bob5n9.png" 
                alt="Meetup Logo" 
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
              />
            </a>
            <a 
              href="https://www.linkedin.com/company/gophercon-africa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-[#0077B5] transition-colors"
            >
              <Image 
                src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744803296/LinkedIn_icon.svg_ljtvmr.png" 
                alt="Meetup Logo" 
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
              />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 GopherCon Africa. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
} 