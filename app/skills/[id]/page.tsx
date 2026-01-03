'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, ExternalLink, Download, File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Anthropic, Notion } from '@lobehub/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
            style={{ borderRadius: '4px' }}
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
            style={{ borderRadius: '4px' }}
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <Navbar />
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
        <Navbar />
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
      <Navbar />

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
                  <CardTitle className="text-2xl mb-2">{skill.name}</CardTitle>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-gray-50 text-gray-600 border border-gray-200 w-fit mb-2">
                    {getOwnerIcon(skill.owner) && (
                      <span className="flex-shrink-0">
                        {getOwnerIcon(skill.owner)}
                      </span>
                    )}
                    {skill.owner}
                  </span>
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
                    curl {typeof window !== 'undefined' ? window.location.origin : 'https://openskills.space'}/api/download/{skill.id} -o {skill.owner}-{skill.name}.zip
                  </code>
                  <button
                    onClick={() => copyToClipboard(`curl ${typeof window !== 'undefined' ? window.location.origin : 'https://openskills.space'}/api/download/${skill.id} -o ${skill.owner}-${skill.name}.zip`, skill.id)}
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

