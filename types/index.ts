export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  owner: string;
}

export interface SkillsResponse {
  skills: Skill[];
  count: number;
}

export interface SeedResponse {
  success: boolean;
  message: string;
  count: number;
}

