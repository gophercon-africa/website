import React from 'react';
import Link from 'next/link';

export default function VisaInfo() {
    return (
        <section id="visa-info" className="py-24 bg-linear-to-b from-white via-[#E8F5E9] to-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Visa Information</h2>
                    <p className="text-xl text-gray-600">Essential information for international attendees</p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
                    <div className="bg-linear-to-r from-[#006B3F] to-[#00A86B] p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">🌍 Traveling to Kenya</h3>
                        <p className="text-green-100">Everything you need to know about obtaining a Kenyan visa or eTA</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                International attendees planning to visit Kenya for GopherCon Africa 2026 will need to obtain an Electronic Travel Authorization (eTA) 
                                or visa depending on their nationality. The official Kenyan government website provides comprehensive information about eTA requirements, 
                                visa types, application procedures, and lists countries exempt from eTA requirements.
                            </p>
                        </div>

                        {/* Key Resources */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            {/* Official eTA Website Card */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-[#006B3F] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl">🏛️</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Official eTA Portal</h4>
                                        <p className="text-gray-600 mb-4">
                                            Visit the official Kenyan eTA portal for detailed visa information and country-specific requirements.
                                        </p>
                                        <Link href="https://etakenya.go.ke/general-information" target="_blank" rel="noopener noreferrer">
                                            <button className="bg-[#006B3F] text-white px-4 py-2 rounded-lg hover:bg-[#005A35] transition-colors duration-200 text-sm font-medium">
                                                Visit eTA Portal →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* eTA Application Card */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-[#00A86B] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl">💻</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply for eTA</h4>
                                        <p className="text-gray-600 mb-4">
                                            Apply for your Kenyan Electronic Travel Authorization online through the official portal.
                                        </p>
                                        <Link href="https://etakenya.go.ke/" target="_blank" rel="noopener noreferrer">
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
                                <div className="shrink-0">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-amber-800 mb-2">Important Notice</h4>
                                    <p className="text-amber-700 leading-relaxed">
                                        We strongly recommend starting your eTA application process well in advance of the conference date. 
                                        Processing times may vary, and some countries may require additional documentation. 
                                        Check the official website for the most up-to-date requirements and exempt countries list.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 eTA Application Tips</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Check if your country is exempt from eTA</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Prepare passport and travel documents</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Apply at least 72 hours before travel</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-green-800 text-sm">Keep digital copies of your eTA approval</span>
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
                            If you have questions about the eTA process or visa requirements, feel free to reach out to our team.
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