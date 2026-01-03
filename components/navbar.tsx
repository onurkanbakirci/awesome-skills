'use client';

import { Info, BookOpen, Github } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-[#eaeaea]">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/icon.png" 
              alt="Agent Skills Logo" 
              width="120" 
              height="120"
              className="object-contain w-16 sm:w-24 md:w-[120px]"
            />
          </a>

          {/* Navigation Links */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* What is this Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm text-[#666] hover:text-black hover:bg-[#fafafa] rounded-lg transition-colors"
                  aria-label="What is this?"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">What is this?</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:w-96 bg-white border-[#eaeaea] shadow-lg" align="end">
                <div className="space-y-3">
                  <h4 className="font-semibold text-base text-black">About Agent Skills</h4>
                  <div className="text-sm text-[#666] space-y-2">
                    <p>
                      <strong className="text-black">Agent Skills</strong> is a curated collection of AI agent skills that you can browse, search, and download for your projects.
                    </p>
                    <p>
                      We aggregate skills from leading AI companies like <strong className="text-black">Anthropic</strong>, <strong className="text-black">Notion</strong>, <strong className="text-black">Composio</strong>, and talented contributors from the community.
                    </p>
                    <div className="pt-1">
                      <p className="font-semibold text-black mb-1.5">Features:</p>
                      <ul className="list-disc list-inside space-y-1 text-[#666] text-xs">
                        <li>Search and filter by owner, category, or tags</li>
                        <li>View skill details and example files</li>
                        <li>Download skills directly as ZIP files</li>
                        <li>Access via REST API for integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* API Docs Link */}
            <a
              href="/api-docs"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm text-[#666] hover:text-black hover:bg-[#fafafa] rounded-lg transition-colors"
              aria-label="API Documentation"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">API Docs</span>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/onurkanbakirci/awesome-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-sm text-black bg-[#fafafa] hover:bg-[#f0f0f0] rounded-lg transition-colors border border-[#eaeaea]"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

