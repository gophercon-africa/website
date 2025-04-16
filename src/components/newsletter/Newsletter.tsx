import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { ExternalToast } from 'sonner';
import Image from 'next/image';
const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    toast.success('Subscribing email:', email as ExternalToast);
    setEmail('');
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <Toaster position="top-center" richColors />
      <div className="bg-[#FDF7F5] p-8 rounded-lg flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex-1 pr-8">
          <h2 className="text-3xl font-bold mb-2">Stay up-to-date with GopherCon Africa</h2>
          <p className="text-gray-600 mb-4">
            Enter your email address to join the GopherCon Africa mailing list and be the first to hear our
            latest news and announcements.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-[#2D3748] text-white px-6 py-2 rounded-md hover:bg-[#1A202C] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="hidden md:block">
          <Image    
            src="/images/mascots/mascot-kenya.png"
            alt="Gopher mascot"
            width={192}
            height={192}
            className="w-48 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 