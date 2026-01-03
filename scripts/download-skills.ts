import fs from 'fs';
import path from 'path';
import https from 'https';

interface Skill {
  id: string;
  name: string;
  sourceUrl: string;
}

const skillsData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'skills.json'), 'utf-8')
);

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

async function downloadGitHubFolder(skill: Skill): Promise<void> {
  try {
    // Convert GitHub tree URL to API URL
    const apiUrl = skill.sourceUrl
      .replace('https://github.com/', 'https://api.github.com/repos/')
      .replace('/tree/main/', '/contents/')
      .replace('/tree/master/', '/contents/');

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
      throw new Error(`Failed to fetch ${skill.name}: ${response.statusText}`);
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

async function downloadAllSkills() {
  console.log('Starting skills download...\n');
  
  for (const skill of skillsData) {
    await downloadGitHubFolder(skill);
  }
  
  console.log('All skills downloaded!');
}

downloadAllSkills().catch(console.error);

