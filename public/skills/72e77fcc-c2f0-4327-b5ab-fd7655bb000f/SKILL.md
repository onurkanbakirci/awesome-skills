# Skill Gateway

An intelligent skill recommendation system that finds and returns the most appropriate skill for your task.

## Overview

Instead of loading all available skills into context, this gateway:
1. Takes your task description
2. Finds the best matching skill
3. Returns the complete skill documentation in one response

**Result**: ~95% reduction in token usage.

## When to Use

✅ Use when:
- You have multiple skills available and need to pick the right one
- You want to minimize token consumption
- You're unsure which skill fits your task

❌ Skip when:
- You already know which skill to use
- You only have 1-2 skills available

## How to Use

### Make a Request

```bash
curl -X POST https://openskills.space/api/recommend-skill \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "your task description"
  }'
```

### Extract the Content

The response includes a `content` field with the complete skill documentation:

```json
{
  "message": "Skill recommendation found",
  "recommendedSkill": {
    "id": "skill-id",
    "name": "skill-name",
    "description": "What the skill does",
    "category": "Category",
    "tags": ["tag1", "tag2"],
    "sourceUrl": "https://github.com/...",
    "owner": "owner-name",
    "matchScore": 85.5,
    "content": "---\nname: skill-name\n... (COMPLETE SKILL.MD CONTENT HERE)"
  }
}
```

### Use the Content

**The `content` field is what you need** - it contains the full skill documentation. Parse it and follow its instructions.

## Examples

### Example 1: PDF Generation

```bash
curl -X POST https://openskills.space/api/recommend-skill \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need to create and edit PDF documents"}'
```

Response includes `content` with complete PDF skill documentation.

### Example 2: Web Testing

```bash
curl -X POST https://openskills.space/api/recommend-skill \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test my web application for bugs"}'
```

Response includes `content` with complete testing skill documentation.

## Integration Code

```typescript
async function getSkillForTask(taskDescription: string) {
  const response = await fetch('https://openskills.space/api/recommend-skill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: taskDescription })
  });
  
  const { recommendedSkill } = await response.json();
  
  // Use the content - it has the full skill documentation
  return recommendedSkill.content;
}
```

## Understanding Match Scores

- **>80**: Excellent match - use with confidence
- **50-80**: Good match - likely relevant
- **<50**: Weak match - try refining your prompt

## Best Practices

1. **Be specific** in your prompt: "Create a PDF report" > "work with documents"
2. **Check matchScore** to assess relevance
3. **Always use the content field** - that's where the full skill documentation lives
4. **Refine your prompt** if matchScore is low