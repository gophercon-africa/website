import React from 'react';
import Image from 'next/image';

export default function Tickets() {
  return (
    <section id="tickets" className="py-24 bg-gradient-to-b from-white via-[#E8F5E9] to-white relative overflow-hidden">
      {/* Decorative Gophers */}
      <div className="absolute -left-10 bottom-20 w-32 h-32 opacity-50 transform -rotate-6">
        <Image
          src="/images/mascots/mascot-kenya.png"
          alt="Gopher with Laptop"
          fill
          className="object-contain floating-gopher delay-300"
        />
      </div>
      <div className="absolute -right-10 bottom-40 w-32 h-32 opacity-50 transform rotate-6">
        <Image
          src="/images/mascots/mascot-kenya.png"
          alt="Gopher with Microphone"
          fill
          className="object-contain floating-gopher delay-500"
        />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-medium text-center text-gray-900 mb-16">Tickets</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Workshop Ticket */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Workshop: Advanced Go Patterns</h3>
                  <p className="text-gray-600 mt-1">
                    Ticket for admission to the Advanced Go Patterns workshop by Dave Cheney on July 15, 2025 only. Does not include conference admission.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-medium">$0.00</span>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">-</span>
                    </button>
                    <input type="number" className="w-12 text-center border-0 text-gray-900" value="0" readOnly />
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conference Student Ticket */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Conference (Student)</h3>
                  <p className="text-gray-600 mt-1">
                    Subsidised rate for full-time students. Valid student ID required.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-medium">$0.00</span>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">-</span>
                    </button>
                    <input type="number" className="w-12 text-center border-0 text-gray-900" value="0" readOnly />
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop TinyGo */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Workshop: Hardware Hacking with TinyGo</h3>
                  <p className="text-gray-600 mt-1">
                    Ticket for admission to the Hardware Hacking with TinyGo workshop by Ron Evans on July 16, 2025 only. Does not include conference admission.
                  </p>
                  <p className="text-sm text-gray-500 mt-2 italic">
                    (Conference attendees can attend for free.)
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-medium">$0.00</span>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">-</span>
                    </button>
                    <input type="number" className="w-12 text-center border-0 text-gray-900" value="0" readOnly />
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Swag */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Misc: Extra Swag</h3>
                  <p className="text-gray-600 mt-1">
                    Looking to get an extra T-shirt or other limited swag? Buy this at the registration table and show our team!
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-medium">$0.00</span>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">-</span>
                    </button>
                    <input type="number" className="w-12 text-center border-0 text-gray-900" value="0" readOnly />
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#006B3F] transition-colors">
                      <span className="text-gray-500">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Code */}
          <div className="p-6 bg-gray-50">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent"
              />
              <button className="bg-[#0066ff] text-white px-8 py-2 rounded-lg font-medium hover:bg-[#0052cc] transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-medium mb-4">Scholarships</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We are happy to offer diversity scholarships to support members of underrepresented groups who may not otherwise have the opportunity to attend the conference. Please apply using this form. Applications close on July 1, 2025 (end-of-day WAT).
          </p>
          <a href="#" className="text-[#0066ff] hover:underline">Apply using this form</a>
        </div>

        {/* Refund Policy */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-medium mb-4">Refund policy</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer refunds for all requests made before July 1, 2025 (end-of-day WAT). 
            There will be a 10% fee for all refunds to cover ticketing and payment processing costs.
          </p>
        </div>
      </div>
    </section>
  );
} 