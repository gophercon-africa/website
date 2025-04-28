'use client';
import { Mail } from 'lucide-react';
import CallForSpeakersForm from '@/src/components/call-for-speakers/CallForSpeakersForm';
import { useRef } from 'react';
import { useState } from 'react';

export default function CallForSpeakersPage() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const toggleForm = () => {
    setShowForm(prev => !prev);
    if (!showForm) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-[#006B3F] mb-8">
          Call for Speakers for GopherCon Africa 2025 is now open! 🎉
        </h1>

        <p className="text-xl mb-8">
          Hurray! The call for speakers for GopherCon Africa 2025 is officially open! 🚀 Join us to make the event a memorable and fantastic one.
        </p>

        <div className="flex justify-center mb-12">
          <button
            onClick={toggleForm}
            className="bg-[#006B3F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#008751] transition-colors flex items-center space-x-2"
          >
            <span>Submit Your Talk</span>

            <Mail className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-6">
          GopherCon Africa 2025 is an opportunity to bring together people with different backgrounds and perspectives on software development.
          We want you (yes, you!) to showcase your perspectives, views, knowledge, expertise, and ideas on technology with other conference
          participants from across Africa and the rest of the world for mutual understanding of contexts, challenges, and opportunities.
        </p>

        <div className="bg-[#006B3F]/10 p-6 rounded-lg mb-8">
          <p className="font-medium">
            Our Call for Speakers is now open and will run from the 1st of August to the 30th of September 2024.
          </p>
          <p className="mt-2">
            If you think you have something great to discuss, submit your idea! If unsure, speak to someone or contact one of our
            speaker mentors to discuss your idea. When in doubt, submit your talk anyway! 😉
          </p>
        </div>

        <h2 className="text-2xl font-bold text-[#006B3F] mt-12 mb-6">Session Types</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Short talk (30 mins)</li>
          <li>Long talk (45 mins)</li>
          <li>Keynote (1hr)</li>
          <li>Workshop (2hrs)</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#006B3F] mt-12 mb-6">Session Tracks</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Go Core Track</li>
          <li>Cloud Native Go</li>
          <li>Go for Web Development</li>
          <li>Systems Programming with Go</li>
          <li>Go Tools and Developer Experience</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#006B3F] mt-12 mb-6">Topics We&apos;re Looking For</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Go internals and challenges in modern software development</li>
          <li>Wild ideas, clever hacks, surprising or cool use cases</li>
          <li>Improving Go developers&apos; lives and productivity</li>
          <li>Pushing Go to its limits</li>
          <li>The Go community, culture, history, past, present & future</li>
          <li>Security best practices in Go</li>
          <li>Whatever you deem appropriate – it&apos;s your conference after all!</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#006B3F] mt-12 mb-6">Submission Guidelines</h2>

        <h3 className="text-xl font-semibold mt-8 mb-4">Abstract</h3>
        <p className="mb-4">
          Your abstract should clearly and concisely summarize the core idea of your talk, workshop, or tutorial in 150-400 words.
          A good abstract answers the questions:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>What is the topic?</li>
          <li>Why is it important?</li>
          <li>What will attendees gain?</li>
        </ul>
        <p>Make it engaging and relevant, showing why your session is valuable for GopherCon Africa&apos;s audience.</p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Audience Level</h3>
        <p className="mb-4">
          Please indicate the intended audience level for your session:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Beginner: No prior knowledge of the topic required</li>
          <li>Intermediate: Some experience with the topic recommended</li>
          <li>Advanced: Deep understanding of the topic required</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#006B3F] mt-12 mb-6">Helpful Resources</h2>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            To help you craft a compelling proposal, we recommend checking out these excellent resources:
          </p>
          <ul className="space-y-4">
            <li>
              <a 
                href="https://blog.gopheracademy.com/gophercon-2017/writing-a-successful-gophercon-proposal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006B3F] hover:text-[#008751] font-medium flex items-center"
              >
                <span className="mr-2">📝</span>
                Writing a Successful GopherCon Proposal
              </a>
              <p className="text-gray-600 mt-1 ml-6">
                A comprehensive guide from Gopher Academy on crafting effective conference proposals
              </p>
            </li>
            <li>
              <a 
                href="https://dave.cheney.net/2017/02/12/how-to-write-a-successful-conference-proposal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006B3F] hover:text-[#008751] font-medium flex items-center"
              >
                <span className="mr-2">📚</span>
                How to Write a Successful Conference Proposal
              </a>
              <p className="text-gray-600 mt-1 ml-6">
                Expert advice from Dave Cheney on creating compelling conference proposals
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-[#006B3F]/10 p-6 rounded-lg mt-12 mb-8">
          <h2 className="text-2xl font-bold text-[#006B3F] mb-4">We Encourage Submissions From:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>First-time speakers:</strong> Don&apos;t worry if this is your first time—your ideas matter!</li>
            <li><strong>Speakers from all backgrounds:</strong> Share your unique perspective, no matter where you&apos;re from</li>
            <li><strong>Women and underrepresented groups:</strong> We want to amplify your voice—please apply!</li>
            <li><strong>Students and learners:</strong> Your fresh ideas are vital to our community</li>
            <li><strong>Industry experts:</strong> Take a moment to give back and share your knowledge with the community</li>
          </ul>
        </div>

        <div className="mt-12 space-y-6">
          <p>
            If you require accessibility accommodations or have specific presentation needs, please email us.
            We&apos;re happy to help ensure a positive experience for all.
          </p>

          <p>
            If you would like to ask a question, you are always welcome to write to the Content Committee:
            <a href="mailto:content@gopherconafrica.org" className="ml-2 text-[#006B3F] hover:text-[#008751] inline-flex items-center">
              <Mail className="w-5 h-5 mr-1" />
              hello@gophers.africa
            </a>
          </p>
        </div>
        <div className="flex justify-end">
          {/* <HeaderAuth /> */}
        </div>
        {showForm && <div ref={formRef}><CallForSpeakersForm /></div>}
      </div>
    </div>
  );
} 