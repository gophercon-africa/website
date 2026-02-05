import React from 'react';
import { Lightbulb, Users, Coffee, ChevronRight } from 'lucide-react';
import YouTubePlayer from 'react-youtube';

export default function About() {
  const videoOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1,
      rel: 0,
      controls: 1,
      showinfo: 1,
      mute: 0,
      playsinline: 1,
    },
  };

  return (
    <section id="about" className="py-24 bg-linear-to-br from-white via-[#E8F5E9] to-[#F1F8E9] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[#006B3F] font-medium mb-4 block">About GopherCon Africa</span>
          <h2 className="text-4xl font-medium text-gray-900 mb-6">Africa&apos;s Premier Go Conference</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are pleased to announce the third annual GopherCon Africa conference. Two days of amazing talks, 
            plentiful networking opportunities, and great socials. GopherCon Africa offers the most up-to-date 
            Go programming information and training.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Conference Highlights */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-[#6B46C1]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Expert-Led Sessions</h3>
                  <p className="text-gray-600">Learn from industry leaders and Go experts through keynotes, technical talks, and workshops.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-[#6B46C1]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Networking</h3>
                  <p className="text-gray-600">Connect with hundreds of Go developers, share experiences, and build lasting relationships.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <Coffee className="w-6 h-6 text-[#6B46C1]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Social Events</h3>
                  <p className="text-gray-600">Enjoy social gatherings, lightning talks, and cultural experiences unique to Africa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Video */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
              <YouTubePlayer
                videoId="zwkomnt--Lg"
                opts={videoOpts}
                className="w-full h-full absolute inset-0"
                iframeClassName="w-full h-full"
              />
            </div>
            <div className="p-6 bg-white">
              <div className="text-[#6B46C1] font-medium mb-2">Featured Talk</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Postgres Protocol Sniffer in Go</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#6B46C1] flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-white">AA</span>
                </div>
                <div>
                  <div className="font-medium">
                  Chukwuemeka Chukwurah</div>
                  <div className="text-gray-600 text-sm">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Video Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
              <YouTubePlayer
                videoId="T4QhWoyI4x8"
                opts={videoOpts}
                className="w-full h-full absolute inset-0"
                iframeClassName="w-full h-full"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Behavior-Driven Development in Go: Automating Acceptance Criteria with GoDog</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#006B3F] flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-white">UI</span>
                </div>
                <span className="text-gray-600">
                David Aniebo</span>
              </div>
            </div>
          </div>

          {/* Video Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
              <YouTubePlayer
                videoId="T4QhWoyI4x8"
                opts={videoOpts}
                className="w-full h-full absolute inset-0"
                iframeClassName="w-full h-full"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Behavior-Driven Development in Go: Automating Acceptance Criteria with GoDog</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#006B3F] flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-white">UI</span>
                </div>
                <span className="text-gray-600">
                David Aniebo</span>
              </div>
            </div>
          </div>

          {/* Video Card 3 */}
          <div className="relative rounded-2xl bg-[#006B3F] p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-medium text-white mb-4">Discover More Content (2025 videos to be uploaded soon)</h3>
              <p className="text-white/90 mb-8">
                Watch all our previous talks and get excited for what&apos;s coming at GopherCon Africa 2024.
              </p>
            </div>
            <a 
              href="https://www.youtube.com/watch?v=onJpueD8xZE&list=PLQGlpekanU1P-maNgWUXksrQ2su2lCF0m"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-white group"
            >
              <span className="font-medium">Watch all videos</span>
              <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 