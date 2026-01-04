'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/skills',
      description: 'Search and filter agent skills',
      parameters: [
        { name: 'q', type: 'string', description: 'Search query to filter skills by name or description', required: false },
        { name: 'owner', type: 'string', description: 'Filter by owner (e.g., anthropic, notion, composio)', required: false },
        { name: 'category', type: 'string', description: 'Filter by category', required: false },
        { name: 'tag', type: 'string', description: 'Filter by tag', required: false },
      ],
      response: {
        skills: 'Array<Skill>',
        count: 'number'
      },
      examples: [
        { label: 'Get all skills', url: '/api/skills' },
        { label: 'Search by keyword', url: '/api/skills?q=design' },
        { label: 'Filter by owner', url: '/api/skills?owner=anthropic' },
        { label: 'Combined filters', url: '/api/skills?q=design&owner=anthropic' },
      ]
    },
    {
      method: 'GET',
      path: '/api/skills/{id}/files',
      description: 'Get all files for a specific skill',
      parameters: [
        { name: 'id', type: 'string', description: 'Unique identifier of the skill', required: true },
      ],
      response: {
        files: 'Array<{ path: string, name: string, content: string, isDirectory: boolean }>'
      },
      examples: [
        { label: 'Example', url: '/api/skills/40052610-0196-41b5-9fb1-e88a3b283af9/files' }
      ]
    },
    {
      method: 'GET',
      path: '/api/download/{id}',
      description: 'Download a skill as a ZIP file',
      parameters: [
        { name: 'id', type: 'string', description: 'Unique identifier of the skill', required: true },
      ],
      response: {
        type: 'application/zip',
        description: 'ZIP file containing all skill files'
      },
      examples: [
        { label: 'Example', url: '/api/download/40052610-0196-41b5-9fb1-e88a3b283af9' }
      ]
    },
  ];

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-black dark:text-white">
            API Endpoints
          </h1>
          <p className="text-lg text-[#666] dark:text-[#aaa] mb-8">
            Integrate Agent Skills into your application using these RESTful API endpoints.
          </p>
        </div>
      </div>

      {/* API Endpoints Section */}
      <div className="bg-white dark:bg-[#1a1a1a] border-t border-[#eaeaea] dark:border-[#333] transition-colors">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="border-[#eaeaea] dark:border-[#333] bg-white dark:bg-[#2a2a2a]">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-mono font-semibold rounded border ${getMethodBadgeColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-base font-mono text-black dark:text-white flex-1 mt-0.5">
                      {endpoint.path}
                    </code>
                  </div>
                  <CardDescription className="text-[#666] dark:text-[#aaa] text-base">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parameters */}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Parameters:</h3>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-start gap-2 text-sm">
                            <code className="px-2 py-0.5 bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded text-black dark:text-white font-mono">
                              {param.name}
                            </code>
                            <span className="text-[#999] dark:text-[#666]">({param.type})</span>
                            {param.required && (
                              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded">
                                required
                              </span>
                            )}
                            <span className="text-[#666] dark:text-[#aaa] flex-1">- {param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Response:</h3>
                    {typeof endpoint.response.type === 'string' ? (
                      <div className="text-sm text-[#666] dark:text-[#aaa]">
                        <span className="font-mono text-black dark:text-white">{endpoint.response.type}</span>
                        {endpoint.response.description && ` - ${endpoint.response.description}`}
                      </div>
                    ) : (
                      <div className="bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded p-3 border border-[#d4d4d4] dark:border-[#444]">
                        <pre className="text-xs font-mono text-black dark:text-white overflow-x-auto">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Examples:</h3>
                    <div className="space-y-3">
                      {endpoint.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="space-y-2">
                          <p className="text-xs text-[#666] dark:text-[#aaa] font-medium">{example.label}:</p>
                          <div className="bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded p-3 border border-[#d4d4d4] dark:border-[#444] flex items-center justify-between gap-2">
                            <code className="text-xs font-mono text-black dark:text-white break-all flex-1">
                              {typeof window !== 'undefined' ? window.location.origin : 'https://openskills.space'}{example.url}
                            </code>
                            <a
                              href={example.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 px-3 py-1 text-xs text-white dark:text-black bg-black dark:bg-white hover:bg-[#333] dark:hover:bg-[#e5e5e5] rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Try →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#eaeaea] dark:border-[#333] bg-white dark:bg-[#1a1a1a] mt-16 transition-colors">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center text-sm text-[#666] dark:text-[#aaa]">
            <span>Built by</span>
            <a
              href="https://github.com/onurkanbakirci"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-black dark:text-white hover:text-[#D97757] transition-colors font-medium"
            >
              @onurkanbakirci
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

