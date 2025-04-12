import React from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Sponsors() {
  return (
    <section className="py-24 bg-gradient-to-br from-white via-[#E8F5E9] to-[#F1F8E9] relative overflow-hidden" id="sponsors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[#006B3F] font-medium mb-4 block">Our Amazing Partners</span>
          <h2 className="text-4xl font-medium text-gray-900 mb-6">Backed by Industry Leaders</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            GopherCon Africa is made possible by these amazing organizations supporting the Go community in Africa.
          </p>
        </div>

        {/* Platinum Sponsors */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-[#6B46C1] to-transparent w-24"></div>
            <h3 className="text-lg font-medium text-[#6B46C1] px-4">Platinum Partners</h3>
            <div className="h-px bg-gradient-to-r from-[#6B46C1] via-[#6B46C1] to-transparent w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="group bg-white rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-20">
                <Image
                  src="/images/sponsors/google.png"
                  alt="Google"
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">Empowering Go developers worldwide</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-20">
                <Image
                  src="/images/sponsors/moniepoint.jpg"
                  alt="MoniePoint"
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">Leading fintech innovation in Africa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFB800] to-transparent w-24"></div>
            <h3 className="text-lg font-medium text-[#FFB800] px-4">Gold Partners</h3>
            <div className="h-px bg-gradient-to-r from-[#FFB800] via-[#FFB800] to-transparent w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
            <div className="group bg-white rounded-2xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-16">
                <Image
                  src="/images/sponsors/APItoolkit.png"
                  alt="APIToolkit"
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">API monitoring and debugging made easy</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-16">
                <Image
                  src="/images/sponsors/partner.svg"
                  alt="Partna"
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">Building the future of business partnerships</p>
              </div>
            </div>
          </div>
        </div>

        {/* Become a Sponsor */}
        <div className="relative mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#006B3F] via-[#008751] to-[#006B3F] rounded-3xl transform -rotate-1 shadow-2xl"></div>
          {/* Decorative Gophers */}
          <div className="absolute -left-16 -top-16 w-32 h-32 opacity-80">
            <Image
              src="/images/mascots/mascot-kenya.png"
              alt="Star Gopher"
              fill
              className="object-contain floating-gopher"
            />
          </div>
          <div className="absolute -right-16 -top-16 w-32 h-32 opacity-80">
            <Image
              src="/images/mascots/mascot-kenya.png"
              alt="Loving Gopher"
              fill
              className="object-contain floating-gopher delay-200"
            />
          </div>
          <div className="absolute -left-16 -bottom-16 w-32 h-32 opacity-80">
            <Image
              src="/images/mascots/mascot-kenya.png"
              alt="Waving Gopher"
              fill
              className="object-contain floating-gopher delay-400"
            />
          </div>
          <div className="absolute -right-16 -bottom-16 w-32 h-32 opacity-80">
            <Image
              src="/images/mascots/mascot-kenya.png"
              alt="Dancing Gopher"
              fill
              className="object-contain floating-gopher delay-600"
            />
          </div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-[#006B3F] mb-6">Become a Partner</h3>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Support the Go community in Africa and showcase your brand to hundreds of passionate developers. 
                Download our sponsorship prospectus to learn more about partnership opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#006B3F] hover:bg-[#008751] text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center group">
                  Download Partnership Prospectus
                  <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white hover:bg-gray-50 text-[#006B3F] border-2 border-[#006B3F] px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center group">
                  Contact Us
                  <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 