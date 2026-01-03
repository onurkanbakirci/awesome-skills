'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Anthropic, Notion } from '@lobehub/icons';
import { Navbar } from '@/components/navbar';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  owner: string;
}

const rotatingPhrases = [
  'the next viral idea.',
  'your startup.',
  'your passion project.',
  'your side hustle.',
  'your AI agent.',
  'your next app.',
];

export default function Home() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // Load all skills initially for filter options
  useEffect(() => {
    const loadAllSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        const data = await response.json();
        setAllSkills(data.skills || []);
      } catch (error) {
        console.error('Error loading all skills:', error);
      }
    };
    loadAllSkills();
  }, []);

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000); // Change every 3 seconds (change to 60000 for 1 minute)

    return () => clearInterval(interval);
  }, []);

  // Search and filter effect with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSkills();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedOwner, selectedCategory, selectedTag]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      if (selectedOwner && selectedOwner !== 'all') {
        params.append('owner', selectedOwner);
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (selectedTag && selectedTag !== 'all') {
        params.append('tag', selectedTag);
      }

      const response = await fetch(`/api/skills?${params}`);
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
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

  // Get unique filter options
  const getUniqueOwners = () => {
    const owners = new Set(allSkills.map(skill => skill.owner));
    return Array.from(owners).sort();
  };

  const getUniqueCategories = () => {
    const categories = new Set(allSkills.map(skill => skill.category));
    return Array.from(categories).sort();
  };

  const getUniqueTags = () => {
    const tags = new Set(allSkills.flatMap(skill => skill.tags));
    return Array.from(tags).filter(tag => tag !== 'official').sort();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getOwnerIcon = (owner: string) => {
    const ownerLower = owner.toLowerCase();
    switch (ownerLower) {
      case 'anthropic':
        return <Anthropic size={20} style={{ color: '#D97757' }} />;
      case 'notion':
        return <Notion size={20} style={{ color: '#000000' }} />;
      case 'obra':
        return (
          <img 
            src={`https://github.com/obra.png`}
            alt="obra" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'composio':
        return (
          <img 
            src="https://avatars.githubusercontent.com/u/128464815?s=200&v=4" 
            alt="Composio" 
            width="20" 
            height="20" 
            style={{ borderRadius: '3px' }}
          />
        );
      case 'lackeyjb':
        return (
          <img 
            src={`https://github.com/lackeyjb.png`}
            alt="lackeyjb" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'k-dense-ai':
        return (
          <img 
            src={`https://github.com/K-Dense-AI.png`}
            alt="K-Dense-AI" 
            width="20" 
            height="20" 
            style={{ borderRadius: '3px' }}
          />
        );
      case 'conorluddy':
        return (
          <img 
            src={`https://github.com/conorluddy.png`}
            alt="conorluddy" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'alonw0':
        return (
          <img 
            src={`https://github.com/alonw0.png`}
            alt="alonw0" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'pleaseprompto':
        return (
          <img 
            src={`https://github.com/PleasePrompto.png`}
            alt="PleasePrompto" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'wrsmith108':
        return (
          <img 
            src={`https://github.com/wrsmith108.png`}
            alt="wrsmith108" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'zxkane':
        return (
          <img 
            src={`https://github.com/zxkane.png`}
            alt="zxkane" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'sanjay3290':
        return (
          <img 
            src={`https://github.com/sanjay3290.png`}
            alt="sanjay3290" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'jthack':
        return (
          <img 
            src={`https://github.com/jthack.png`}
            alt="jthack" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'fvadicamo':
        return (
          <img 
            src={`https://github.com/fvadicamo.png`}
            alt="fvadicamo" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      case 'muratcankoylan':
        return (
          <img 
            src={`https://github.com/muratcankoylan.png`}
            alt="muratcankoylan" 
            width="20" 
            height="20" 
            style={{ borderRadius: '50%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-2">
              <span className="block text-black mb-1">Find a <span className="italic" style={{ color: '#D97757' }}>skill</span> for</span>
              <span className="block text-[#666]" style={{ minHeight: '1.2em' }}>
                {rotatingPhrases[currentPhraseIndex].split('').map((char, index) => (
                  <span
                    key={`${currentPhraseIndex}-${index}`}
                    className="inline-block animate-wave"
                    style={{
                      animationDelay: `${index * 0.03}s`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </h1>

            <p className="text-sm text-[#666] mt-4 mb-6">
              Fast. Powerful. Smart.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="text"
              placeholder="Search for skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 text-base bg-white border-[#e5e5e5] text-black placeholder:text-[#999] focus:border-black hover:border-[#999] transition-all duration-200 pl-12 rounded-lg shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={selectedOwner} onValueChange={setSelectedOwner}>
              <SelectTrigger className="w-full bg-white border-[#e5e5e5] text-black hover:border-[#999] transition-all duration-200">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {getUniqueOwners().map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    <div className="flex items-center gap-2">
                      {getOwnerIcon(owner)}
                      <span>{owner}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white border-[#e5e5e5] text-black hover:border-[#999] transition-all duration-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full bg-white border-[#e5e5e5] text-black hover:border-[#999] transition-all duration-200">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {getUniqueTags().map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Skills Grid Section */}
      <div className="bg-white border-t border-[#eaeaea]">
        <div className="container mx-auto px-6 pt-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="border-[#eaeaea] flex flex-col">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6 mb-4" />
                      <Skeleton className="h-12 w-full mt-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Skills Grid */}
            {!loading && skills.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <Card
                    key={skill.id}
                    onClick={() => router.push(`/skills/${skill.id}`)}
                    className="group relative hover:shadow-lg transition-all duration-200 border-[#eaeaea] hover:border-[#999] flex flex-col cursor-pointer"
                    style={{
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s backwards`
                    }}
                  >
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                      <a
                        href={`/api/download/${skill.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1.5 bg-white border border-[#eaeaea] rounded-md hover:bg-[#fafafa]"
                        title="Download skill"
                      >
                        <Download className="w-4 h-4 text-[#666]" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(skill.sourceUrl, '_blank');
                        }}
                        className="p-1.5 bg-white border border-[#eaeaea] rounded-md hover:bg-[#fafafa]"
                        title="Open in GitHub"
                      >
                        <ExternalLink className="w-4 h-4 text-[#666]" />
                      </button>
                    </div>

                    <CardHeader className="pb-0 mb-2">
                      <CardTitle className="text-lg mb-1">
                        {highlightText(skill.name, searchQuery)}
                      </CardTitle>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded bg-gray-50 text-gray-600 border border-gray-200 w-fit">
                        {getOwnerIcon(skill.owner) && (
                          <span className="flex-shrink-0">
                            {getOwnerIcon(skill.owner)}
                          </span>
                        )}
                        {skill.owner}
                      </span>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <p className="text-sm text-[#666] mb-3 leading-relaxed flex-1">
                        {highlightText(skill.description, searchQuery)}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {skill.tags.filter(tag => tag !== 'official').map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-md bg-[#fafafa] text-[#666] border border-[#eaeaea]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Download Command */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-[#666] mb-1">Download:</p>
                        <div className="p-2 bg-[#f5f5f5] rounded border border-[#d4d4d4] flex items-center justify-between gap-2">
                          <code className="text-xs text-black font-mono flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            curl {typeof window !== 'undefined' ? window.location.origin : 'https://openskills.space'}/api/download/{skill.id} -o {skill.owner}-{skill.name}.zip
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`curl ${typeof window !== 'undefined' ? window.location.origin : 'https://openskills.space'}/api/download/${skill.id} -o ${skill.owner}-${skill.name}.zip`, skill.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-[#e5e5e5] rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === skill.id ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#666]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && skills.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#666] text-lg mb-2">
                  {searchQuery ? `No skills found for "${searchQuery}"` : 'No skills available'}
                </p>
                <p className="text-[#999] text-sm">
                  {searchQuery ? 'Try a different search term' : 'Check your data file'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes wave {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-wave {
          animation: wave 0.5s ease-out forwards;
          opacity: 0;
        }
        
        /* Hide scrollbar but keep functionality */
        :global(.scrollbar-hide) {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        :global(.scrollbar-hide::-webkit-scrollbar) {
          display: none;
        }
      `}</style>

      {/* Footer */}
      <footer className="border-t border-[#eaeaea] bg-white mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center text-sm text-[#666]">
            <span>Built by</span>
            <a
              href="https://github.com/onurkanbakirci"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-black hover:text-[#D97757] transition-colors font-medium"
            >
              @onurkanbakirci
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
