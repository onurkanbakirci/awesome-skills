import { NextRequest, NextResponse } from 'next/server';
import skillsData from '@/data/skills.json';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  installation: string;
  sourceUrl: string;
  owner: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const owner = searchParams.get('owner')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';
    const tag = searchParams.get('tag')?.toLowerCase() || '';

    let skills: Skill[] = skillsData as Skill[];

    // Apply search query if provided
    if (query) {
      skills = skills.filter((skill) => {
        const searchableText = `${skill.name} ${skill.description}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply owner filter
    if (owner) {
      skills = skills.filter((skill) => skill.owner?.toLowerCase() === owner);
    }

    // Apply category filter
    if (category) {
      skills = skills.filter((skill) => skill.category?.toLowerCase() === category);
    }

    // Apply tag filter
    if (tag) {
      skills = skills.filter((skill) => 
        skill.tags?.some(t => t.toLowerCase() === tag)
      );
    }

    // Sort by name
    skills.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      skills,
      count: skills.length,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills', skills: [], count: 0 },
      { status: 500 }
    );
  }
}

