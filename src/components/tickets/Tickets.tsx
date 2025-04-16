import React from 'react';
import ToastWrapper from '../common/ToastWrapper';

export default function Tickets() {
  return (
    <section id="tickets" className="py-24 bg-gradient-to-b from-white via-[#E8F5E9] to-white relative overflow-hidden">
     
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-medium text-center text-gray-900 mb-16">Tickets</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Workshop Ticket */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Workshop: [ To be announced ]</h3>
                  <p className="text-gray-600 mt-1">
                    Ticket for admission to the [ To be announced ] workshop by [ To be announced ] soon. Does not include conference admission.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <ToastWrapper
                      message="To be announced soon!" 
                      className="ml-4" 
                    >
                      <span className="text-xl font-medium"> <button className="bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005A35] transition-colors duration-200">Get Ticket</button></span>
                    </ToastWrapper>
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
                  <h3 className="text-xl font-medium text-gray-900">Conference: [ To be announced ]</h3>
                  <p className="text-gray-600 mt-1">
                    Price of the ticket for the conference [ To be announced ] soon. Does not include workshop admission.
                  </p>
                  
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <ToastWrapper
                      message="To be announced soon!" 
                      className="ml-4" 
                    >
                      <span className="text-xl font-medium"> <button className="bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005A35] transition-colors duration-200">Get Ticket</button></span>
                    </ToastWrapper>
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
                    Looking to get an extra T-shirt or other limited swag? You can buy this at the registration table!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-medium mb-4">Scholarships</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We are happy to offer diversity scholarships to support members of underrepresented groups who may not otherwise have the opportunity to attend the conference. Please apply using this form. Applications close on [ To be announced ] (end-of-day WAT).
          </p>
          <ToastWrapper
            message="To be announced soon!" 
            className="ml-4" 
          >
            <span className="text-xl font-medium"> <button className="bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005A35] transition-colors duration-200">Apply using this form</button></span>
          </ToastWrapper>
        </div>

        {/* Refund Policy */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-medium mb-4">Refund policy</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer refunds for all requests made before [ To be announced ] (end-of-day WAT). 
            There will be a 10% fee for all refunds to cover ticketing and payment processing costs.
          </p>
        </div>
      </div>
    </section>
  );
} 