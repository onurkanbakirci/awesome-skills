'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Copy, Check, ExternalLink, Download, File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Anthropic, Notion } from '@lobehub/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  owner: string;
}

interface SkillFile {
  path: string;
  name: string;
  content: string;
  isDirectory: boolean;
}

export default function SkillDetailPage() {
  const params = useParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [files, setFiles] = useState<SkillFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SkillFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loadingFiles, setLoadingFiles] = useState(false);

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
      
      // Fetch files for this skill
      if (foundSkill) {
        fetchSkillFiles(foundSkill.id);
      }
    } catch (error) {
      console.error('Error fetching skill:', error);
      setSkill(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillFiles = async (skillId: string) => {
    setLoadingFiles(true);
    try {
      const response = await fetch(`/api/skills/${skillId}/files`);
      const data = await response.json();
      setFiles(data.files || []);
      
      // Auto-select first non-directory file
      const firstFile = data.files.find((f: SkillFile) => !f.isDirectory);
      if (firstFile) {
        setSelectedFile(firstFile);
      }
    } catch (error) {
      console.error('Error fetching skill files:', error);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
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

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'md': 'markdown',
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sh': 'bash',
      'txt': 'text',
    };
    return languageMap[ext || ''] || 'text';
  };

  const buildFileTree = (files: SkillFile[]) => {
    const tree: Record<string, any> = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            isDirectory: index < parts.length - 1 || file.isDirectory,
            file: index === parts.length - 1 ? file : null,
            children: {}
          };
        }
        current = current[part].children;
      });
    });
    
    return tree;
  };

  const renderFileTree = (tree: Record<string, any>, level = 0) => {
    return Object.values(tree).map((node: any) => {
      if (node.isDirectory) {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <button
              onClick={() => toggleFolder(node.path)}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f5] text-left text-sm"
              style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-[#666] flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#666] flex-shrink-0" />
              )}
              <Folder className="w-4 h-4 text-[#666] flex-shrink-0" />
              <span className="text-[#333] truncate">{node.name}</span>
            </button>
            {isExpanded && renderFileTree(node.children, level + 1)}
          </div>
        );
      } else if (node.file) {
        const isSelected = selectedFile?.path === node.file.path;
        return (
          <button
            key={node.path}
            onClick={() => setSelectedFile(node.file)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f5] text-left text-sm ${
              isSelected ? 'bg-[#e5e5e5]' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
          >
            <File className="w-4 h-4 text-[#666] flex-shrink-0 ml-6" />
            <span className={`truncate ${isSelected ? 'text-black font-medium' : 'text-[#666]'}`}>
              {node.name}
            </span>
          </button>
        );
      }
      return null;
    });
  };

  const getOwnerIcon = (owner: string) => {
    const ownerLower = owner.toLowerCase();
    switch (ownerLower) {
      case 'anthropic':
        return <Anthropic size={20} style={{ color: '#D97757' }} />;
      case 'notion':
        return <Notion size={20} style={{ color: '#000000' }} />;
      case 'obra':
        // Using a simple user icon for obra
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#6366F1"/>
          </svg>
        );
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
            <Card 
              className="mb-6 border-[#eaeaea]"
              style={{
                animation: 'fadeIn 0.4s ease-out'
              }}
            >
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
            <Card 
              className="border-[#eaeaea]"
              style={{
                animation: 'fadeIn 0.4s ease-out 0.1s backwards'
              }}
            >
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
          <Card 
            className="mb-6 border-[#eaeaea]"
            style={{
              animation: 'fadeIn 0.4s ease-out'
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getOwnerIcon(skill.owner) && (
                      <div className="flex-shrink-0 text-[#666]">
                        {getOwnerIcon(skill.owner)}
                      </div>
                    )}
                    <CardTitle className="text-2xl">{skill.name}</CardTitle>
                  </div>
                  {skill.tags.includes('official') ? (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-600 border border-blue-200 w-fit mb-2">
                      Official
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-gray-50 text-gray-600 border border-gray-200 w-fit mb-2">
                      {getOwnerIcon(skill.owner) && (
                        <span className="flex-shrink-0">
                          {getOwnerIcon(skill.owner)}
                        </span>
                      )}
                      {skill.owner}
                    </span>
                  )}
                  <p className="text-[#666] text-base">{skill.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.tags.filter(tag => tag !== 'official').map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-[#fafafa] text-[#666] border border-[#eaeaea]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Download Command */}
              <div>
                <p className="text-xs text-[#666] mb-1.5">Download with curl:</p>
                <div className="p-3 bg-[#f5f5f5] rounded-md border border-[#d4d4d4] flex items-center justify-between gap-2">
                  <code className="text-sm text-black font-mono flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    curl {typeof window !== 'undefined' ? window.location.origin : ''}/api/download/{skill.id} -o {skill.owner}-{skill.name}.zip
                  </code>
                  <button
                    onClick={() => copyToClipboard(`curl ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/download/${skill.id} -o ${skill.owner}-${skill.name}.zip`, skill.id)}
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

          {/* Source Code Section */}
          <Card 
            className="border-[#eaeaea]"
            style={{
              animation: 'fadeIn 0.4s ease-out 0.1s backwards'
            }}
          >
            <CardHeader className="pb-3 border-b border-[#eaeaea]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Source Code</CardTitle>
                <div className="flex gap-3">
                  <a
                    href={`/api/download/${skill.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#333] transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={skill.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border border-[#eaeaea] rounded-lg hover:bg-[#fafafa] transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingFiles ? (
                <div className="p-6 text-center">
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : files.length === 0 ? (
                <div className="p-6 text-center text-[#666]">
                  No files found
                </div>
              ) : (
                <div className="flex" style={{ height: '600px' }}>
                  {/* File Explorer */}
                  <div className="w-64 border-r border-[#eaeaea] overflow-y-auto">
                    <div className="py-2">
                      {renderFileTree(buildFileTree(files))}
                    </div>
                  </div>
                  
                  {/* Code Viewer */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {selectedFile ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#eaeaea] bg-[#fafafa]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-[#666]" />
                              <span className="text-sm font-medium text-[#333]">
                                {selectedFile.name}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(selectedFile.content, `file-${selectedFile.path}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-[#e5e5e5] rounded transition-colors"
                              title="Copy file content"
                            >
                              {copiedId === `file-${selectedFile.path}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-green-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#666]" />
                                  <span className="text-[#666]">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                          {selectedFile.content === '[Binary file]' ? (
                            <div className="p-6 text-center text-[#666]">
                              Binary file (cannot display content)
                            </div>
                          ) : (
                            <SyntaxHighlighter
                              language={getFileLanguage(selectedFile.name)}
                              style={vscDarkPlus}
                              showLineNumbers
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                fontSize: '13px',
                                height: '100%',
                              }}
                            >
                              {selectedFile.content}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[#666]">
                        Select a file to view its contents
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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

