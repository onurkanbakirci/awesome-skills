import fs from 'fs';
import path from 'path';
import https from 'https';

interface Skill {
  id: string;
  name: string;
  sourceUrl: string;
}

// Only the newly added skills
const newSkills: Skill[] = [
  {
    id: "9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
    name: "notebooklm-skill",
    sourceUrl: "https://github.com/PleasePrompto/notebooklm-skill"
  },
  {
    id: "0f1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    name: "linear",
    sourceUrl: "https://github.com/wrsmith108/linear-claude-skill/tree/main/skills/linear"
  },
  {
    id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    name: "aws-skills",
    sourceUrl: "https://github.com/zxkane/aws-skills"
  },
  {
    id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    name: "postgres",
    sourceUrl: "https://github.com/sanjay3290/ai-skills/tree/main/skills/postgres"
  },
  {
    id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    name: "imagen",
    sourceUrl: "https://github.com/sanjay3290/ai-skills/tree/main/skills/imagen"
  },
  {
    id: "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
    name: "ffuf-skill",
    sourceUrl: "https://github.com/jthack/ffuf_claude_skill/tree/main/ffuf-skill"
  },
  {
    id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    name: "creating-skills",
    sourceUrl: "https://github.com/fvadicamo/dev-agent-skills/tree/main/skills/creating-skills"
  },
  {
    id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
    name: "git-commit",
    sourceUrl: "https://github.com/fvadicamo/dev-agent-skills/tree/main/skills/git-commit"
  },
  {
    id: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
    name: "github-pr-creation",
    sourceUrl: "https://github.com/fvadicamo/dev-agent-skills/tree/main/skills/github-pr-creation"
  },
  {
    id: "8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e",
    name: "github-pr-merge",
    sourceUrl: "https://github.com/fvadicamo/dev-agent-skills/tree/main/skills/github-pr-merge"
  },
  {
    id: "9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
    name: "github-pr-review",
    sourceUrl: "https://github.com/fvadicamo/dev-agent-skills/tree/main/skills/github-pr-review"
  },
  {
    id: "0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
    name: "advanced-evaluation",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/advanced-evaluation"
  },
  {
    id: "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    name: "context-compression",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/context-compression"
  },
  {
    id: "2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
    name: "context-degradation",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/context-degradation"
  },
  {
    id: "3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d",
    name: "context-fundamentals",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/context-fundamentals"
  },
  {
    id: "4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e",
    name: "context-optimization",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/context-optimization"
  },
  {
    id: "5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f",
    name: "evaluation",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/evaluation"
  },
  {
    id: "6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a",
    name: "memory-systems",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/memory-systems"
  },
  {
    id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    name: "multi-agent-patterns",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/multi-agent-patterns"
  },
  {
    id: "8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c",
    name: "project-development",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/project-development"
  },
  {
    id: "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
    name: "tool-design",
    sourceUrl: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/tool-design"
  }
];

const SKILLS_DIR = path.join(process.cwd(), 'public', 'skills');

// Create skills directory if it doesn't exist
if (!fs.existsSync(SKILLS_DIR)) {
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
}

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadGitHubFolder(skill: Skill): Promise<void> {
  try {
    // Convert GitHub tree URL to API URL
    let apiUrl = skill.sourceUrl
      .replace('https://github.com/', 'https://api.github.com/repos/')
      .replace('/tree/main/', '/contents/')
      .replace('/tree/master/', '/contents/');
    
    // Handle root repository URLs (no /tree/ part)
    if (!apiUrl.includes('/contents/')) {
      apiUrl = apiUrl.replace('https://api.github.com/repos/', 'https://api.github.com/repos/').replace(/\/?$/, '/contents/');
    }

    console.log(`Downloading ${skill.name}...`);
    
    // Prepare headers with optional GitHub token
    const headers: Record<string, string> = {
      'User-Agent': 'skills-downloader',
      'Accept': 'application/vnd.github.v3+json'
    };
    
    // Add GitHub token if available in environment
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    // Add delay to avoid rate limiting
    await sleep(1000);
    
    // Fetch directory contents from GitHub API
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        if (rateLimitRemaining === '0' && rateLimitReset) {
          const resetDate = new Date(parseInt(rateLimitReset) * 1000);
          throw new Error(`Rate limit exceeded. Resets at ${resetDate.toLocaleString()}`);
        }
      }
      throw new Error(`Failed to fetch ${skill.name}: ${response.statusText} (${response.status})`);
    }

    const files = await response.json();
    
    // Create skill directory
    const skillDir = path.join(SKILLS_DIR, skill.id);
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    // Download each file
    for (const file of files) {
      if (file.type === 'file') {
        const filePath = path.join(skillDir, file.name);
        
        // Download using raw content URL
        const rawUrl = file.download_url;
        await downloadFile(rawUrl, filePath);
        console.log(`  ✓ ${file.name}`);
      }
    }

    console.log(`✓ ${skill.name} downloaded successfully\n`);
  } catch (error) {
    console.error(`✗ Failed to download ${skill.name}:`, error);
  }
}

async function downloadNewSkills() {
  console.log('Starting download of new skills...\n');
  console.log(`Total skills to download: ${newSkills.length}\n`);
  
  for (const skill of newSkills) {
    await downloadGitHubFolder(skill);
  }
  
  console.log('Download complete!');
}

downloadNewSkills().catch(console.error);

