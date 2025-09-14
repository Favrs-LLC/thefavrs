# Tasks: TheFavrs Website Recreation

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 14, Supabase, TypeScript, Tailwind CSS
   → Libraries: @thefavrs/forms, @thefavrs/newsletter, @thefavrs/supabase
2. Load optional design documents:
   → data-model.md: 6 entities → model tasks
   → contracts/api-spec.yaml: 8 endpoints → contract test tasks
   → research.md: Tech stack decisions → setup tasks
3. Generate tasks by category:
   → Setup: Next.js init, Supabase setup, GitHub/Vercel config
   → Tests: Contract tests for all API endpoints
   → Core: Libraries, models, services, API routes
   → Integration: Database, middleware, logging
   → Polish: E2E tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T040)
6. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Next.js App Router structure: `/app`, `/lib`, `/components`
- Tests at repository root: `/tests`
- Libraries in `/lib` directory

## Phase 3.1: Infrastructure Setup
- [ ] T001 Initialize Next.js 14 project with TypeScript and App Router: `npx create-next-app@latest . --typescript --app --tailwind --eslint`
- [ ] T002 [P] Create GitHub repository and push initial commit
- [ ] T003 [P] Set up Supabase project and get connection credentials
- [ ] T004 Configure environment variables in `.env.local` with Supabase URL, anon key, and service key
- [ ] T005 [P] Install core dependencies: `npm install @supabase/supabase-js react-hook-form zod @hookform/resolvers resend pino`
- [ ] T006 [P] Install dev dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom playwright @types/node`
- [ ] T007 Configure Vercel project and link to GitHub repository for auto-deployment
- [ ] T008 Set up project structure: create `/lib`, `/components/ui`, `/components/sections`, `/tests` directories

## Phase 3.2: Database Setup & Migrations
- [ ] T009 Create Supabase migration for all tables in `/supabase/migrations/001_initial_schema.sql`
- [ ] T010 [P] Create seed data script in `/supabase/seed.sql` with initial team members and services
- [ ] T011 Run migrations and seed data: `npx supabase db push && npx supabase db seed`
- [ ] T012 [P] Generate TypeScript types from Supabase: `npx supabase gen types typescript --local > /lib/supabase/types.ts`

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T013 [P] Contract test POST /api/contact in `/tests/contract/contact.test.ts`
- [ ] T014 [P] Contract test POST /api/newsletter in `/tests/contract/newsletter.test.ts`
- [ ] T015 [P] Contract test GET /api/newsletter/confirm in `/tests/contract/newsletter-confirm.test.ts`
- [ ] T016 [P] Contract test POST /api/newsletter/unsubscribe in `/tests/contract/newsletter-unsubscribe.test.ts`
- [ ] T017 [P] Contract test GET /api/content/{slug} in `/tests/contract/content.test.ts`
- [ ] T018 [P] Contract test GET /api/services in `/tests/contract/services.test.ts`
- [ ] T019 [P] Contract test GET /api/team in `/tests/contract/team.test.ts`
- [ ] T020 [P] Contract test POST /api/logs in `/tests/contract/logs.test.ts`
- [ ] T021 [P] Integration test for contact form submission flow in `/tests/integration/contact-flow.test.ts`
- [ ] T022 [P] Integration test for newsletter signup flow in `/tests/integration/newsletter-flow.test.ts`
- [ ] T023 [P] E2E test for homepage visitor journey in `/tests/e2e/homepage.spec.ts`

## Phase 3.4: Library Implementation (ONLY after tests are failing)

### Supabase Library
- [ ] T024 Create @thefavrs/supabase library in `/lib/supabase/index.ts` with client initialization
- [ ] T025 [P] Create CLI for database operations in `/lib/supabase/cli.ts` with --migrate, --seed, --reset commands
- [ ] T026 [P] Create database helper functions in `/lib/supabase/helpers.ts` for common queries

### Forms Library
- [ ] T027 [P] Create @thefavrs/forms library in `/lib/forms/index.ts` with form validation schemas
- [ ] T028 [P] Create contact form schema with Zod in `/lib/forms/schemas/contact.ts`
- [ ] T029 [P] Create form submission handler in `/lib/forms/handlers/submit.ts`
- [ ] T030 [P] Create CLI for form testing in `/lib/forms/cli.ts` with --validate command

### Newsletter Library
- [ ] T031 [P] Create @thefavrs/newsletter library in `/lib/newsletter/index.ts` with subscription logic
- [ ] T032 [P] Create subscription handler in `/lib/newsletter/subscribe.ts`
- [ ] T033 [P] Create confirmation handler in `/lib/newsletter/confirm.ts`
- [ ] T034 [P] Create unsubscribe handler in `/lib/newsletter/unsubscribe.ts`
- [ ] T035 [P] Create CLI for newsletter operations in `/lib/newsletter/cli.ts` with --list, --export commands

## Phase 3.5: API Implementation

- [ ] T036 Implement POST /api/contact route in `/app/api/contact/route.ts`
- [ ] T037 Implement POST /api/newsletter route in `/app/api/newsletter/route.ts`
- [ ] T038 Implement GET /api/newsletter/confirm route in `/app/api/newsletter/confirm/route.ts`
- [ ] T039 Implement POST /api/newsletter/unsubscribe route in `/app/api/newsletter/unsubscribe/route.ts`
- [ ] T040 Implement GET /api/content/[slug] route in `/app/api/content/[slug]/route.ts`
- [ ] T041 Implement GET /api/services route in `/app/api/services/route.ts`
- [ ] T042 Implement GET /api/team route in `/app/api/team/route.ts`
- [ ] T043 Implement POST /api/logs route in `/app/api/logs/route.ts`
- [ ] T044 Add rate limiting middleware in `/app/api/middleware.ts` using Vercel Edge Config

## Phase 3.6: Frontend Components

- [ ] T045 Create base layout in `/app/layout.tsx` with header, footer, and navigation
- [ ] T046 [P] Create Header component in `/components/sections/Header.tsx` with navigation menu
- [ ] T047 [P] Create Footer component in `/components/sections/Footer.tsx` with newsletter signup
- [ ] T048 [P] Create HeroSection component in `/components/sections/HeroSection.tsx`
- [ ] T049 [P] Create ServicesSection component in `/components/sections/ServicesSection.tsx`
- [ ] T050 [P] Create TeamSection component in `/components/sections/TeamSection.tsx`
- [ ] T051 [P] Create ContactForm component in `/components/forms/ContactForm.tsx` with React Hook Form
- [ ] T052 [P] Create NewsletterForm component in `/components/forms/NewsletterForm.tsx`
- [ ] T053 [P] Create Button, Input, and Card components in `/components/ui/`

## Phase 3.7: Page Implementation

- [ ] T054 Implement homepage in `/app/page.tsx` combining all sections
- [ ] T055 [P] Implement Privacy Policy page in `/app/privacy-policy/page.tsx`
- [ ] T056 [P] Implement Terms & Conditions page in `/app/terms-conditions/page.tsx`
- [ ] T057 [P] Create 404 error page in `/app/not-found.tsx`
- [ ] T058 [P] Create error boundary in `/app/error.tsx`

## Phase 3.8: Integration & Optimization

- [ ] T059 Add structured logging with pino in `/lib/logging/index.ts`
- [ ] T060 Implement frontend error reporting to /api/logs
- [ ] T061 Add SEO metadata to all pages using Next.js metadata API
- [ ] T062 [P] Generate sitemap.xml in `/app/sitemap.ts`
- [ ] T063 [P] Configure robots.txt in `/public/robots.txt`
- [ ] T064 Add responsive design breakpoints and mobile menu toggle
- [ ] T065 Optimize images with Next.js Image component and blur placeholders
- [ ] T066 Configure Content Security Policy headers in `next.config.js`

## Phase 3.9: Email Integration

- [ ] T067 Set up Resend account and get API key
- [ ] T068 Create email templates in `/lib/emails/` for contact and newsletter confirmations
- [ ] T069 Integrate Resend in contact form handler for admin notifications
- [ ] T070 Integrate Resend in newsletter confirmation flow

## Phase 3.10: Testing & Validation

- [ ] T071 Run all contract tests and ensure they pass: `npm run test:contract`
- [ ] T072 Run all integration tests: `npm run test:integration`
- [ ] T073 Run E2E tests with Playwright: `npm run test:e2e`
- [ ] T074 Run Lighthouse audit and fix any issues below 90 score
- [ ] T075 Test all forms with invalid data to verify validation
- [ ] T076 Test mobile responsiveness on actual devices
- [ ] T077 Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Phase 3.11: Deployment & Launch

- [ ] T078 Set production environment variables in Vercel dashboard
- [ ] T079 Configure custom domain in Vercel (thefavrs.com)
- [ ] T080 Set up monitoring with Vercel Analytics
- [ ] T081 Configure error tracking with Sentry or LogRocket
- [ ] T082 Run production smoke tests after deployment
- [ ] T083 Set up database backups in Supabase
- [ ] T084 Document deployment rollback procedure

## Dependencies
- Infrastructure (T001-T008) must complete first
- Database setup (T009-T012) before any API work
- ALL tests (T013-T023) MUST be written and failing before implementation
- Libraries (T024-T035) before API routes (T036-T044)
- API routes before frontend integration
- Components (T045-T053) can be built in parallel
- Pages (T054-T058) require components to be complete
- Testing (T071-T077) after all implementation
- Deployment (T078-T084) is the final phase

## Parallel Execution Examples

### Batch 1: Initial Setup (can run simultaneously)
```bash
Task: "Create GitHub repository and push initial commit"
Task: "Set up Supabase project and get connection credentials"
Task: "Install core dependencies"
Task: "Install dev dependencies"
```

### Batch 2: All Contract Tests (MUST run before implementation)
```bash
Task: "Contract test POST /api/contact"
Task: "Contract test POST /api/newsletter"
Task: "Contract test GET /api/newsletter/confirm"
Task: "Contract test POST /api/newsletter/unsubscribe"
Task: "Contract test GET /api/content/{slug}"
Task: "Contract test GET /api/services"
Task: "Contract test GET /api/team"
Task: "Contract test POST /api/logs"
```

### Batch 3: Library Development (after tests fail)
```bash
Task: "Create @thefavrs/forms library"
Task: "Create @thefavrs/newsletter library"
Task: "Create form validation schemas"
Task: "Create subscription handler"
```

### Batch 4: UI Components (independent files)
```bash
Task: "Create Header component"
Task: "Create Footer component"
Task: "Create HeroSection component"
Task: "Create ServicesSection component"
Task: "Create TeamSection component"
```

## Notes
- CRITICAL: Follow TDD - tests MUST fail before implementation
- Each task creates or modifies specific files - no conflicts in [P] tasks
- Commit after each completed task for rollback capability
- Use feature flags for gradual rollout if needed
- Monitor error rates after deployment

## Success Criteria
- [ ] All 84 tasks completed
- [ ] All tests passing (contract, integration, E2E)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Zero console errors in production
- [ ] Contact form successfully sends emails
- [ ] Newsletter signup with confirmation works
- [ ] Site is fully responsive
- [ ] Deployment successful on Vercel
- [ ] Original thefavrs.com functionality replicated

---

**Total Tasks**: 84
**Estimated Duration**: 3-4 weeks with single developer
**Parallel Potential**: ~40% of tasks can run concurrently