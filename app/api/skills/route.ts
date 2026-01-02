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
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    let skills: Skill[] = skillsData as Skill[];

    // Apply search query if provided
    if (query) {
      skills = skills.filter((skill) => {
        const searchableText = `${skill.name} ${skill.description}`.toLowerCase();
        return searchableText.includes(query);
      });
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

