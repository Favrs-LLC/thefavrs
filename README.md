# TheFavrs Website

A modern recreation of the TheFavrs website using Next.js 14 and Supabase, built with the Specify Framework methodology.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Hosting**: Vercel
- **Testing**: Vitest, Playwright

## Getting Started

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/thefavrs/website.git
   cd website
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Add your Supabase and Resend API keys
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm run test:all
   ```

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── sections/          # Page sections
│   └── forms/             # Form components
├── lib/                   # Core libraries
│   ├── supabase/          # Database client
│   ├── forms/             # Form handling
│   └── newsletter/        # Newsletter logic
├── tests/                 # Test suites
└── specs/                 # Feature specifications
```

## Architecture

This project follows constitutional principles:
- **Library-First**: Every feature is a self-contained library
- **Test-Driven Development**: Tests written before implementation
- **CLI Interface**: Each library exposes CLI commands
- **Real Dependencies**: Uses actual Supabase, no mocks

## Development Workflow

1. **Feature Specification**: `/specify "feature description"`
2. **Implementation Plan**: `/plan "technical details"`
3. **Task Generation**: `/tasks`
4. **Implementation**: Execute tasks in order

## Libraries

- `@thefavrs/forms` - Contact form validation and submission
- `@thefavrs/newsletter` - Newsletter subscription management
- `@thefavrs/supabase` - Database client and migrations

## Deployment

The site auto-deploys to Vercel when changes are merged to `main`.

## Contributing

1. Create feature branch: `git checkout -b feature-name`
2. Follow TDD: Write tests first
3. Implement feature
4. Submit PR

## Contact

- **Website**: https://thefavrs.com
- **Email**: will@thefavrs.com
- **Phone**: (615) 944-8853