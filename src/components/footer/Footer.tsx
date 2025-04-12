import React from 'react';
import { Code2, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#006B3F] border-t border-[#008751] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-8 md:mb-0">
            <Code2 className="w-8 h-8 text-white" />
            <span className="ml-3 text-xl font-bold text-white">GopherCon Africa</span>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#008751] text-center text-white/70">
          <p>&copy; 2025 GopherCon Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 