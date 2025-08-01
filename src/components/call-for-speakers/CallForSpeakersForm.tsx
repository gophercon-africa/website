'use client';

import React, { useActionState, useState, startTransition } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/src/styles/globals.css';
import * as actions from "@/src/actions";
import { TalkFormState } from '@/src/actions/call-for-speakers/create';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import paths from '@/src/path'; 

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export default function CallForSpeakersForm() {
    const [formState, formAction, isSubmitting] = useActionState(actions.createTalk, {
        errors: {}
    } as TalkFormState);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        bio: '',
        talkTitle: '',
        talkDescription: '',
        talkDuration: '',
        talkLevel: '',
        previousSpeakingExperience: '',
        additionalNotes: '',
        eventYear: new Date().getFullYear().toString(),
        IsAccepted: false,
        IsPendingReview: true
    });
    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        
        if (isSubmittingRef.current && !isSubmitting) {
            if (!formState?.errors || Object.keys(formState.errors).length === 0) {
                toast.success('Your talk has been submitted successfully. We will review it and get back to you soon. Thank you for your submission!');
                redirect(paths.callForSpeakers());
            } else {
                toast.error('There was an error submitting your form. Please try again or contact us directly at hello@gophercon.africa');
            }
        }
        isSubmittingRef.current = isSubmitting;
    }, [isSubmitting, formState?.errors]);

    // Add effect to scroll to errors
    React.useEffect(() => {
        if (formState.errors && Object.keys(formState.errors).length > 0) {
            const firstErrorField = Object.keys(formState.errors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
        }
    }, [formState?.errors]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataObj = new FormData();
        formDataObj.append('fullName', formData.fullName);
        formDataObj.append('email', formData.email);
        formDataObj.append('phone', formData.phone);
        formDataObj.append('company', formData.company);
        formDataObj.append('title', formData.title);
        formDataObj.append('bio', formData.bio);
        formDataObj.append('talkTitle', formData.talkTitle);
        formDataObj.append('talkDescription', formData.talkDescription);
        formDataObj.append('talkDuration', formData.talkDuration);
        formDataObj.append('talkLevel', formData.talkLevel);
        formDataObj.append('previousSpeakingExperience', formData.previousSpeakingExperience);
        formDataObj.append('additionalNotes', formData.additionalNotes);
        formDataObj.append('eventYear', formData.eventYear);
        formDataObj.append('IsAccepted', 'false');
        formDataObj.append('IsPendingReview', 'true');
       
        

        // Submit the talk to the database
        startTransition(() => {
            try {
                formAction(formDataObj);
            } catch (error) {
                console.error('Form submission error:', error);
                toast.error('There was an error submitting your talk. Please try again or contact us directly at hello@gophercon.africa');
            }
        });
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
            <div className="bg-linear-to-b from-[#006B3F]/5 to-white mt-12">
                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                Share your expertise and passion for Go with the GopherCon Africa community.
                                We&apos;re looking for engaging talks that cover a wide range of Go topics.
                            </p>
                        </div>

                        {formState?.errors && Object.keys(formState?.errors).length > 0 && (
                            <div className="bg-red-500 text-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold">Form Errors</h3>
                                <ul className="list-disc pl-6">
                                    {Object.entries(formState?.errors).map(([field, errors]) => (
                                        <li key={field}>  
                                            {errors?.map((error: string) => (
                                                <p key={error}>{error}</p>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}  

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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        />
                                        <p className="text-red-500 text-sm">{formState?.errors?.fullName?.join(", ")}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        />
                                        <p className="text-red-500 text-sm">{formState?.errors?.email?.join(", ")}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        />
                                        <p className="text-red-500 text-sm">{formState?.errors?.phone}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        />
                                        <p className="text-red-500 text-sm">{formState?.errors?.company}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        />
                                        <p className="text-red-500 text-sm">{formState?.errors?.title}</p>
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
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] px-4 py-3 text-base transition-all duration-200 ease-in-out min-h-[120px]"
                                    placeholder="Tell us about yourself and your experience with Go"
                                />
                                <p className="text-red-500 text-sm">{formState?.errors?.bio}</p>
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
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                    />
                                    <p className="text-red-500 text-sm">{formState?.errors?.talkTitle}</p>
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
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] px-4 py-3 text-base transition-all duration-200 ease-in-out min-h-[180px]"
                                        placeholder="Provide a detailed description of your talk"
                                    />
                                    <p className="text-red-500 text-sm">{formState?.errors?.talkDescription}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        >
                                            <option value="">Select duration</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                        </select>
                                        <p className="text-red-500 text-sm">{formState?.errors?.talkDuration}</p>
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
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] h-12 px-4 text-base transition-all duration-200 ease-in-out"
                                        >
                                            <option value="">Select level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                        <p className="text-red-500 text-sm">{formState?.errors?.talkLevel}</p>
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
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] px-4 py-3 text-base transition-all duration-200 ease-in-out min-h-[120px]"
                                    placeholder="List any previous speaking engagements or relevant experience"
                                />
                                <p className="text-red-500 text-sm">{formState?.errors?.previousSpeakingExperience}</p>
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
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006B3F] focus:ring-[#006B3F] px-4 py-3 text-base transition-all duration-200 ease-in-out min-h-[120px]"
                                    placeholder="Any additional information you'd like to share"
                                />
                                <p className="text-red-500 text-sm">{formState?.errors?.additionalNotes}</p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-2xs text-base font-medium rounded-lg text-white bg-[#006B3F] hover:bg-[#008751] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#006B3F] transition-colors"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 