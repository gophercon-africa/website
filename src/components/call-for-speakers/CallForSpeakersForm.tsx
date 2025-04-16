'use client';

import React, { useState } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/src/styles/globals.css';
import { SpeakerFormData } from '@/src/types/talk';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});


export default function CallForSpeakersForm() {
    const [formData, setFormData] = useState<SpeakerFormData>( {} as SpeakerFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen bg-white ${plusJakartaSans.variable} font-sans`}>
      <div className="bg-gradient-to-b from-[#006B3F]/5 to-white mt-12">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Share your expertise and passion for Go with the GopherCon Africa community.
                We&apos;re looking for engaging talks that cover a wide range of Go topics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-lg p-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#006B3F]">Personal Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    />
                  </div>
                </div>
              </div>

              {/* Speaker Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Speaker Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                  placeholder="Tell us about yourself and your experience with Go"
                />
              </div>

              {/* Talk Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#006B3F]">Talk Information</h3>
                <div>
                  <label htmlFor="talkTitle" className="block text-sm font-medium text-gray-700">
                    Talk Title
                  </label>
                  <input
                    type="text"
                    name="talkTitle"
                    id="talkTitle"
                    required
                    value={formData.talkTitle}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                  />
                </div>
                <div>
                  <label htmlFor="talkDescription" className="block text-sm font-medium text-gray-700">
                    Talk Description
                  </label>
                  <textarea
                    name="talkDescription"
                    id="talkDescription"
                    rows={6}
                    required
                    value={formData.talkDescription}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    placeholder="Provide a detailed description of your talk"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="talkDuration" className="block text-sm font-medium text-gray-700">
                      Talk Duration
                    </label>
                    <select
                      name="talkDuration"
                      id="talkDuration"
                      required
                      value={formData.talkDuration}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    >
                      <option value="">Select duration</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="talkLevel" className="block text-sm font-medium text-gray-700">
                      Talk Level
                    </label>
                    <select
                      name="talkLevel"
                      id="talkLevel"
                      required
                      value={formData.talkLevel}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Previous Speaking Experience */}
              <div>
                <label htmlFor="previousSpeakingExperience" className="block text-sm font-medium text-gray-700">
                  Previous Speaking Experience
                </label>
                <textarea
                  name="previousSpeakingExperience"
                  id="previousSpeakingExperience"
                  rows={4}
                  value={formData.previousSpeakingExperience}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                  placeholder="List any previous speaking engagements or relevant experience"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  id="additionalNotes"
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F]"
                  placeholder="Any additional information you'd like to share"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#006B3F] hover:bg-[#008751] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006B3F] transition-colors"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 