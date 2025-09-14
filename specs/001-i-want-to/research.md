# Technical Research & Decisions

**Feature**: TheFavrs Website Recreation
**Date**: 2025-01-14
**Branch**: 001-i-want-to

## Executive Summary
Technical decisions for recreating TheFavrs.com using Next.js 14 with App Router, Supabase for data persistence, and Vercel for hosting. All clarifications from the specification have been resolved based on modern web development best practices and the user's technical requirements.

## Technology Stack Decisions

### 1. Frontend Framework
**Decision**: Next.js 14 with App Router
**Rationale**:
- Full-stack capabilities reduce complexity (single deployment)
- Built-in SSR/SSG for SEO optimization
- Native Vercel integration for optimal performance
- React Server Components for better performance
**Alternatives considered**:
- Remix: Good but less Vercel-optimized
- Astro: Better for static sites, limited interactivity
- Pure React: Requires separate backend setup

### 2. Database & Backend
**Decision**: Supabase (PostgreSQL + Auth + Realtime)
**Rationale**:
- User specified Supabase for data storage
- Built-in auth system for future admin features
- Row Level Security for data protection
- Realtime subscriptions for future features
**Alternatives considered**:
- Firebase: Google ecosystem lock-in
- PlanetScale: Database-only, no auth
- Custom PostgreSQL: More setup complexity

### 3. Styling Solution
**Decision**: Tailwind CSS + shadcn/ui components
**Rationale**:
- Rapid development with utility classes
- Consistent design system
- Mobile-first responsive design
- Small bundle size with purging
**Alternatives considered**:
- CSS Modules: More verbose
- Styled Components: Runtime overhead
- Vanilla CSS: Slower development

### 4. Form Handling
**Decision**: React Hook Form + Zod validation
**Rationale**:
- Performant with minimal re-renders
- Type-safe validation with Zod
- Built-in error handling
- Accessible by default
**Alternatives considered**:
- Formik: Heavier, more complex
- Native forms: Less user feedback
- React Final Form: Less maintained

### 5. Email Service
**Decision**: Resend for transactional emails
**Rationale**:
- Simple API, good DX
- React Email templates
- Vercel integration
- Reliable delivery
**Alternatives considered**:
- SendGrid: More complex setup
- AWS SES: Requires more configuration
- Mailgun: Higher starting costs

## Clarification Resolutions

### FR-009: Contact Form Storage
**Resolution**: Store in Supabase `contact_submissions` table
- Immediate database persistence
- Email notification via Resend to will@thefavrs.com
- Admin dashboard for viewing submissions (future phase)

### FR-010: Newsletter Subscription Handling
**Resolution**: Hybrid approach
- Store in Supabase `newsletter_subscribers` table
- Sync with email service provider (Resend/Mailchimp)
- Double opt-in flow for compliance

### FR-012: Future Expansion Support
**Resolution**: Modular architecture
- Component-based design for easy additions
- CMS-ready data structure in Supabase
- API routes for external integrations
- Markdown/MDX support for content

### FR-015: Content Management
**Resolution**: Progressive enhancement strategy
- Phase 1: Content in code (immediate deployment)
- Phase 2: Supabase CMS tables with admin UI
- Phase 3: Full headless CMS integration if needed

## Architecture Decisions

### 1. Project Structure
```
/app                    # Next.js App Router
  /(marketing)         # Public pages
    /page.tsx          # Homepage
    /privacy-policy    # Legal page
    /terms-conditions  # Legal page
  /api                 # API routes
    /contact          # Form submission
    /newsletter       # Subscription
    /logs            # Frontend logging
/lib                  # Shared libraries
  /supabase          # DB client & types
  /forms             # Form handling
  /newsletter        # Subscription logic
/components          # React components
  /ui               # Base components
  /sections         # Page sections
```

### 2. Data Model
```sql
-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new'
);

-- Future: CMS tables for dynamic content
```

### 3. Deployment Strategy
- GitHub repository for version control
- Vercel deployment with GitHub integration
- Automatic deployments on main branch
- Preview deployments for PRs
- Environment variables for Supabase/Resend keys

## Performance Optimizations

### 1. Image Optimization
- Next.js Image component for automatic optimization
- WebP format with fallbacks
- Lazy loading for below-fold images
- Blur placeholders for LCP

### 2. Bundle Optimization
- Route-based code splitting
- Dynamic imports for heavy components
- Tree shaking with modern bundler
- CSS purging with Tailwind

### 3. Caching Strategy
- Static pages with ISR where applicable
- Vercel Edge caching
- Supabase query caching
- Browser caching headers

## Security Considerations

### 1. Form Security
- CSRF protection via Next.js
- Rate limiting on API routes
- Input sanitization with Zod
- Honeypot fields for spam prevention

### 2. Data Protection
- Environment variables for secrets
- Supabase Row Level Security
- HTTPS enforced via Vercel
- Content Security Policy headers

### 3. Compliance
- GDPR-compliant data handling
- Privacy Policy and Terms pages
- Cookie consent (when needed)
- Data retention policies

## Testing Strategy

### 1. Unit Tests
- Vitest for component testing
- Testing Library for React components
- Zod schema validation tests

### 2. Integration Tests
- API route testing with Supertest
- Supabase client mocking
- Form submission flows

### 3. E2E Tests
- Playwright for critical user paths
- Visual regression testing
- Cross-browser testing
- Mobile responsiveness tests

## Migration Plan

### 1. Content Migration
- Extract current site content
- Convert to markdown/components
- Preserve SEO metadata
- Redirect old URLs if needed

### 2. DNS Migration
- Set up Vercel domain
- Configure DNS records
- SSL certificate provisioning
- Monitor for issues

### 3. Launch Checklist
- Performance audit
- Accessibility audit
- SEO audit
- Browser testing
- Load testing

## Future Enhancements

### Phase 2 (CMS)
- Supabase-based content management
- Admin authentication with Supabase Auth
- WYSIWYG editor for content
- Media library for images

### Phase 3 (Features)
- Blog/News section
- Portfolio/Case studies
- Event calendar
- Client portal
- Analytics dashboard

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase downtime | High | Implement fallback/offline mode |
| SEO ranking drop | Medium | 301 redirects, maintain URLs |
| Performance issues | Medium | CDN, caching, monitoring |
| Spam submissions | Low | Rate limiting, captcha if needed |

## Decision Log

1. **Next.js over Remix**: Better Vercel integration
2. **Supabase over Firebase**: PostgreSQL flexibility
3. **Tailwind over CSS-in-JS**: Better performance
4. **Resend over SendGrid**: Simpler integration
5. **Vitest over Jest**: Faster, better ESM support

## Resources & Documentation

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

---

All technical decisions align with the constitutional requirements for simplicity, testability, and library-first architecture. The stack chosen provides a solid foundation for both immediate needs and future expansion.