'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Anthropic } from '@lobehub/icons';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  owner: string;
}

export default function SkillDetailPage() {
  const params = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkill();
  }, [params.id]);

  const fetchSkill = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/skills`);
      const data = await response.json();
      const foundSkill = data.skills.find((s: Skill) => s.id === params.id);
      setSkill(foundSkill || null);
    } catch (error) {
      console.error('Error fetching skill:', error);
      setSkill(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getOwnerIcon = (owner: string) => {
    const ownerLower = owner.toLowerCase();
    switch (ownerLower) {
      case 'anthropic':
        return <Anthropic size={20} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <nav className="bg-white border-b border-[#eaeaea]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 bg-black flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                </div>
                <span className="text-sm font-normal text-black">LLM Skills</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-black bg-[#fafafa] hover:bg-[#f0f0f0] rounded-lg transition-colors border border-[#eaeaea]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-6 border-[#eaeaea]">
              <CardHeader className="pb-3">
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
            <Card className="border-[#eaeaea]">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-2/3 mx-auto mb-6" />
                  <Skeleton className="h-10 w-40 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (!skill) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <nav className="bg-white border-b border-[#eaeaea]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 bg-black flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                </div>
                <span className="text-sm font-normal text-black">LLM Skills</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-black bg-[#fafafa] hover:bg-[#f0f0f0] rounded-lg transition-colors border border-[#eaeaea]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <p className="text-[#666] text-lg">Skill not found</p>
            <a href="/" className="mt-4 text-black hover:underline inline-block">
              Go back home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#eaeaea]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 bg-black flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              </div>
              <span className="text-sm font-normal text-black">LLM Skills</span>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-black bg-[#fafafa] hover:bg-[#f0f0f0] rounded-lg transition-colors border border-[#eaeaea]"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Skill Info Card */}
          <Card className="mb-6 border-[#eaeaea]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getOwnerIcon(skill.owner) && (
                      <div className="flex-shrink-0 text-[#666]">
                        {getOwnerIcon(skill.owner)}
                      </div>
                    )}
                    <CardTitle className="text-2xl">{skill.name}</CardTitle>
                  </div>
                  <p className="text-[#666] text-base">{skill.description}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-md bg-[#f5f5f5] text-[#666] border border-[#eaeaea] whitespace-nowrap">
                  {skill.category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-[#fafafa] text-[#666] border border-[#eaeaea]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Download Command */}
              <div>
                <p className="text-xs text-[#666] mb-1.5">Download with curl:</p>
                <div className="p-3 bg-[#f5f5f5] rounded-md border border-[#d4d4d4] flex items-center justify-between gap-2">
                  <code className="text-sm text-black font-mono flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    curl {typeof window !== 'undefined' ? window.location.origin : ''}/api/download/{skill.id} -o skill.zip
                  </code>
                  <button
                    onClick={() => copyToClipboard(`curl ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/download/${skill.id} -o skill.zip`, skill.id)}
                    className="flex-shrink-0 p-1.5 hover:bg-[#e5e5e5] rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === skill.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#666]" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Source Link */}
          <Card className="border-[#eaeaea]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Source Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-[#666]" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-[#666] mb-6">
                  View the complete source code, documentation, and examples on GitHub
                </p>
              <div className="flex gap-3 justify-center">
                <a
                  href={`/api/download/${skill.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-[#333] transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Skill
                </a>
                <a
                  href={skill.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black border border-[#eaeaea] rounded-lg hover:bg-[#fafafa] transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar but keep functionality */
        :global(.scrollbar-hide) {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        :global(.scrollbar-hide::-webkit-scrollbar) {
          display: none;
        }
      `}</style>
    </main>
  );
}

