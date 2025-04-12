import React from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function InfoCards() {
  return (
    <section className="py-24 bg-gradient-to-t from-[#F1F8E9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Card */}
          <div className="bg-[#F3E8FF] rounded-3xl p-12 relative overflow-hidden">
            <div className="max-w-lg">
              <div className="text-[#6B46C1] mb-4 font-medium">About GopherCon</div>
              <h2 className="text-4xl font-medium text-gray-900 mb-6">Returning for our 2nd year</h2>
              <p className="text-gray-600 mb-8 text-lg font-normal">
                We are pleased to announce the second annual GopherCon Africa conference. Two days of amazing talks, plentiful networking opportunities and great socials. GopherCon Africa offers the most up-to-date Go programming information and training.
              </p>
              <a href="#about" className="inline-flex items-center text-gray-900 font-medium hover:text-[#6B46C1] transition-colors">
                Read about the event
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48">
              <Image
                src="/images/mascots/mascot-kenya.png"
                alt="Waving Gopher"
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>

          {/* Call for Papers Card */}
          <div className="bg-[#FFF5F5] rounded-3xl p-12 relative overflow-hidden">
            <div className="max-w-lg">
              <div className="text-[#FF6B6B] mb-4">The best speakers</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Call for Papers</h2>
              <p className="text-gray-600 mb-8 text-lg">
                The GopherCon Africa 2025 Call for Papers will be open early next year. Follow us on social media to find out about updates.
              </p>
              <a href="#cfp" className="inline-flex items-center text-gray-900 font-semibold hover:text-[#FF6B6B] transition-colors">
                Submit your paper
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48">
              <Image
                src="/images/mascots/mascot-kenya.png"
                alt="Gopher with Book"
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Testimonial 1 */}
          <div className="bg-[#1E1E1E] rounded-3xl p-8 text-white">
            <div className="mb-6">
              <blockquote className="text-lg italic mb-4">
                "The talks were truly inspiring, with deep insights into efficiency and performance in solutions, the importance of testing, and the value of clean coding. We also explored the power of interfaces and how they drive better software design"
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#6B46C1] flex items-center justify-center">
                    <span className="text-xl font-semibold">P</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Blessed Rafael</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[#1E1E1E] rounded-3xl p-8 text-white">
            <div className="mb-6">
              <blockquote className="text-lg italic mb-4">
                "The talks were truly inspiring, with deep insights into efficiency and performance in solutions, the importance of testing, and the value of clean coding. We also explored the power of interfaces and how they drive better software design"
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#6B46C1] flex items-center justify-center">
                    <span className="text-xl font-semibold">A</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Blessed Rafael</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 