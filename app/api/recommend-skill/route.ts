import { NextRequest, NextResponse } from 'next/server';
import skillsData from '@/data/skills.json';
import fs from 'fs';
import path from 'path';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  owner: string;
}

// Read skill markdown content
function getSkillContent(skillId: string): string | null {
  const skillDir = path.join(process.cwd(), 'public', 'skills', skillId);

  // Try SKILL.md first
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    try {
      return fs.readFileSync(skillMdPath, 'utf-8');
    } catch (error) {
      console.error(`Error reading SKILL.md for ${skillId}:`, error);
    }
  }

  // Try README.md as fallback
  const readmePath = path.join(skillDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    try {
      return fs.readFileSync(readmePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading README.md for ${skillId}:`, error);
    }
  }

  return null;
}

// Calculate relevance score between prompt and skill
function calculateRelevanceScore(prompt: string, skill: Skill): number {
  const promptLower = prompt.toLowerCase();
  const promptWords = promptLower.split(/\s+/).filter(word => word.length > 2);

  let score = 0;

  // Check name (weight: 3)
  const nameLower = skill.name.toLowerCase();
  promptWords.forEach(word => {
    if (nameLower.includes(word)) {
      score += 3;
    }
  });

  // Check description (weight: 2)
  const descriptionLower = skill.description.toLowerCase();
  promptWords.forEach(word => {
    if (descriptionLower.includes(word)) {
      score += 2;
    }
  });

  // Check tags (weight: 2.5)
  skill.tags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    promptWords.forEach(word => {
      if (tagLower.includes(word) || word.includes(tagLower)) {
        score += 2.5;
      }
    });
  });

  // Check category (weight: 1.5)
  const categoryLower = skill.category.toLowerCase();
  promptWords.forEach(word => {
    if (categoryLower.includes(word)) {
      score += 1.5;
    }
  });

  // Bonus: Check for exact phrase matches in description (weight: 5)
  if (descriptionLower.includes(promptLower)) {
    score += 5;
  }

  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const skills: Skill[] = skillsData as Skill[];

    // Calculate scores for all skills
    const skillsWithScores = skills.map(skill => ({
      skill,
      score: calculateRelevanceScore(prompt, skill)
    }));

    // Sort by score (descending)
    skillsWithScores.sort((a, b) => b.score - a.score);

    // Filter out skills with score 0
    const relevantSkills = skillsWithScores.filter(item => item.score > 0);

    if (relevantSkills.length === 0) {
      return NextResponse.json({
        message: 'No matching skill found for your prompt',
        recommendedSkill: null
      });
    }

    // Get the skill content for the best match
    const bestSkill = relevantSkills[0].skill;
    const skillContent = getSkillContent(bestSkill.id);

    // Return only the best match with its content
    return NextResponse.json({
      message: 'Skill recommendation found',
      recommendedSkill: {
        ...bestSkill,
        matchScore: relevantSkills[0].score,
        content: skillContent
      }
    });

  } catch (error) {
    console.error('Error recommending skill:', error);
    return NextResponse.json(
      { error: 'Failed to recommend skill' },
      { status: 500 }
    );
  }
}

