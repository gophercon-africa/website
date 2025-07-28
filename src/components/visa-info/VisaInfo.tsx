import React from 'react';
import Link from 'next/link';

export default function VisaInfo() {
    return (
        <section id="visa-info" className="py-24 bg-gradient-to-b from-white via-[#E8F5E9] to-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Visa Information</h2>
                    <p className="text-xl text-gray-600">Essential information for international attendees</p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
                    <div className="bg-gradient-to-r from-[#006B3F] to-[#00A86B] p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">🌍 Traveling to Nigeria</h3>
                        <p className="text-green-100">Everything you need to know about obtaining a Nigerian visa</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                International attendees planning to visit Nigeria for the conference will need to obtain the appropriate visa. 
                                The official Nigerian government website provides comprehensive information about visa types, application requirements, 
                                and the complete application process.
                            </p>
                        </div>

                        {/* Key Resources */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            {/* Official Website Card */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#006B3F] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl">🏛️</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Official Immigration Website</h4>
                                        <p className="text-gray-600 mb-4">
                                            Visit the Nigeria Immigration Service for detailed visa information and requirements.
                                        </p>
                                        <Link href="https://immigration.gov.ng" target="_blank" rel="noopener noreferrer">
                                            <button className="bg-[#006B3F] text-white px-4 py-2 rounded-lg hover:bg-[#005A35] transition-colors duration-200 text-sm font-medium">
                                                Visit Website →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* e-Visa Portal Card */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#00A86B] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl">💻</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">e-Visa Application Portal</h4>
                                        <p className="text-gray-600 mb-4">
                                            Apply for your Nigerian visa online through the official e-Visa portal.
                                        </p>
                                        <Link href="https://portal.immigration.gov.ng" target="_blank" rel="noopener noreferrer">
                                            <button className="bg-[#00A86B] text-white px-4 py-2 rounded-lg hover:bg-[#008A5A] transition-colors duration-200 text-sm font-medium">
                                                Apply Online →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-amber-800 mb-2">Important Notice</h4>
                                    <p className="text-amber-700 leading-relaxed">
                                        We strongly recommend starting your visa application process well in advance of the conference date. 
                                        Processing times may vary, and early application helps ensure you receive your visa on time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Application Tips</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Check visa requirements for your country</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Prepare required documents in advance</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Apply early to allow processing time</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Keep digital copies of all documents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="text-center">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 inline-block">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h4>
                        <p className="text-gray-600 mb-4">
                            If you have questions about the visa process, feel free to reach out to our team.
                        </p>
                        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}