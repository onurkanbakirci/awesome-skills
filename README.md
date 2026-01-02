# LLM Skills Project

A Next.js application for browsing and downloading LLM skills with a clean, Vercel-inspired design.

## Features

- 🔍 **Search**: Real-time search across skills with keyword highlighting
- 📦 **Download**: Download skills as ZIP files directly from the app
- 🎨 **Modern UI**: Clean, minimal design inspired by Vercel
- ⚡ **Fast**: File-based search with no external dependencies
- 🎯 **TypeScript**: Fully typed for better developer experience

## Getting Started

### Install dependencies

```bash
npm install
```

### Download Skills

Download all skills from the GitHub repository:

```bash
npm run download-skills
```

This will fetch all skills and store them in `public/skills/` directory with UUID-based folder names.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── download/[id]/   # Download skill as ZIP
│   │   └── skills/           # List and search skills
│   ├── skills/[id]/          # Skill detail pages
│   └── page.tsx              # Main page with search
├── data/
│   └── skills.json           # Skills metadata with UUIDs
├── public/
│   └── skills/               # Downloaded skill files (UUID folders)
├── scripts/
│   └── download-skills.ts    # Script to download skills from GitHub
└── components/
    └── ui/                   # shadcn/ui components
```

## Skills Data

Each skill has:
- **UUID**: Unique identifier (v4)
- **Name**: Skill name (e.g., "algorithmic-art")
- **Description**: What the skill does
- **Category**: Design, Development, Productivity, etc.
- **Tags**: Searchable tags
- **Installation**: NPM command to install
- **Source URL**: GitHub repository link

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Archiver** - ZIP file creation

## License

MIT
