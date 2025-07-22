# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 blog application called "Soon Log" - a Korean tech blog for sharing development knowledge and experiences. The project uses:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS v4
- **Content**: MDX for blog posts
- **Package Manager**: pnpm
- **Testing**: Jest with Testing Library
- **Linting**: ESLint with Prettier
- **Git Hooks**: Husky with lint-staged

## Development Commands

### Core Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes prebuild scripts)
- `pnpm start` - Start production server
- `pnpm prebuild` - Generate posts data and search index (runs automatically before build)

### Code Quality
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode

### Scripts
- `tsx scripts/generate-posts-data.ts` - Generate posts metadata JSON
- `tsx scripts/generate-search-index.ts` - Build search index for Lunr.js

## Architecture

### Content System
- **Posts Location**: `/posts/[post-name]/` directories
- **Post Structure**: Each post has `index.mdx` and `meta.ts` files
- **Metadata**: Type-safe post metadata via `PostMetadata` interface
- **Build Process**: Posts are processed into JSON at build time for performance

### Key Directories
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - React components (all have corresponding test files)
- `/src/lib/` - Utility functions and shared logic
- `/src/hooks/` - Custom React hooks
- `/src/types/` - TypeScript type definitions
- `/posts/` - MDX blog post content
- `/scripts/` - Build-time content processing scripts

### Component Architecture
- **Theme System**: Dark/light mode with `ThemeProvider` and theme persistence
- **Post Filtering**: Real-time filtering by category, tags, and search
- **Infinite Scroll**: Progressive loading of blog posts
- **Search**: Lunr.js-powered full-text search with Korean support
- **MDX Components**: Custom components for code blocks with syntax highlighting

### State Management
- Uses React hooks and context for theme management
- URL-based filter state synchronization
- Local storage for theme persistence

## Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled with `noUncheckedIndexedAccess` and `noUnusedLocals`
- Path aliases: `@/*` maps to `./src/*`
- No implicit any, unused variables are errors

### Component Patterns
- All components have co-located test files
- Use behavior-driven testing focusing on user interactions
- Consistent naming: PascalCase for components, kebab-case for files
- Props interfaces follow `ComponentNameProps` pattern

### Import Organization
ESLint enforces specific import order:
1. Node built-ins
2. External packages
3. Internal modules
4. Relative imports
Alphabetical sorting within each group with case-insensitive ordering

### Git Commit Format
Follow conventional commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```
Types: feat, fix, docs, style, refactor, test, chore

## Testing Strategy

### Testing Philosophy
- Focus on user behavior, not implementation details
- Test business logic and data flow
- Verify side effects of user interactions
- Use `@testing-library/react` for component testing

### Test Structure
- All components have `.test.tsx` files
- Snapshots in `__snapshots__/` directories
- Integration tests for build scripts
- Coverage reporting enabled

## Build Process

### Pre-build Steps
1. Generate posts metadata from `/posts/` directory
2. Create search index for client-side search
3. Process MDX files and extract content

### Key Build Outputs
- `/public/posts/posts.json` - Categorized post metadata
- `/public/data/lunr-index.json` - Search index
- Static generation for all routes

## Development Notes

### MDX Setup
- Configured with GitHub Flavored Markdown support
- Custom components in `/src/mdx-components.tsx`
- Code highlighting with `react-syntax-highlighter`

### Performance Considerations
- Posts data pre-generated at build time
- Infinite scroll for post lists
- Image optimization through Next.js
- Font optimization with local fonts

### SEO Implementation
- Comprehensive metadata in root layout
- Dynamic Open Graph tags per post
- Sitemap and RSS feed generation
- Korean locale optimization

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

This codebase prioritizes type safety, performance, and maintainability with comprehensive testing coverage.