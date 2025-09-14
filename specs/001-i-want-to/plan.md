# Implementation Plan: TheFavrs Website Recreation


**Branch**: `001-i-want-to` | **Date**: 2025-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i-want-to/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Recreation of TheFavrs.com website from Squarespace to a modern Next.js application hosted on Vercel, with Supabase for data storage. The website showcases company services, founder profiles, and provides contact/newsletter signup capabilities with future expansion support.

## Technical Context
**Language/Version**: TypeScript 5.x / Node.js 20.x
**Primary Dependencies**: Next.js 14 (App Router), Supabase Client SDK, Tailwind CSS
**Storage**: Supabase (PostgreSQL) for newsletter signups, contact submissions, future CMS
**Testing**: Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Vercel Edge Runtime / Web browsers (mobile + desktop)
**Project Type**: web - full-stack Next.js application
**Performance Goals**: <100ms TTFB, Core Web Vitals passing, <3s page load
**Constraints**: SEO-optimized, mobile-responsive, accessible (WCAG 2.1 AA)
**Scale/Scope**: Initial: ~4 pages, ~1k newsletter subscribers; Future: CMS-driven content

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 2 (frontend + tests) - Next.js is full-stack
- Using framework directly? YES (Next.js App Router, Supabase SDK)
- Single data model? YES (Supabase schema shared across app)
- Avoiding patterns? YES (no unnecessary abstractions)

**Architecture**:
- EVERY feature as library? YES - form handling, newsletter, data access
- Libraries listed:
  - @thefavrs/forms - Contact form validation and submission
  - @thefavrs/newsletter - Newsletter subscription management
  - @thefavrs/supabase - Database client and migrations
- CLI per library: Each library will have CLI for testing/operations
- Library docs: llms.txt format planned? YES

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? YES
- Git commits show tests before implementation? YES
- Order: Contract→Integration→E2E→Unit strictly followed? YES
- Real dependencies used? YES (Supabase test instance)
- Integration tests for: new libraries, contract changes, shared schemas? YES
- FORBIDDEN: Implementation before test, skipping RED phase - UNDERSTOOD

**Observability**:
- Structured logging included? YES (pino logger)
- Frontend logs → backend? YES (via API endpoint)
- Error context sufficient? YES (request ID, user context)

**Versioning**:
- Version number assigned? 1.0.0
- BUILD increments on every change? YES (automated in CI)
- Breaking changes handled? N/A (initial version)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 (Web application) - Next.js full-stack with integrated frontend/backend

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/bash/update-agent-context.sh claude` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
Based on the artifacts generated in Phase 1, the /tasks command will create:

1. **Infrastructure Setup Tasks** (1-5):
   - Initialize Next.js project with TypeScript [P]
   - Set up Supabase project and migrations [P]
   - Configure GitHub repository and Vercel deployment [P]
   - Set up testing infrastructure (Vitest, Playwright)
   - Configure environment variables and secrets

2. **Library Development Tasks** (6-15):
   - Create @thefavrs/supabase library with CLI [P]
   - Create @thefavrs/forms library with validation [P]
   - Create @thefavrs/newsletter library with subscription logic [P]
   - Write contract tests for each API endpoint (4 tasks)
   - Write integration tests for each library (3 tasks)

3. **API Implementation Tasks** (16-20):
   - Implement /api/contact endpoint with tests
   - Implement /api/newsletter endpoint with tests
   - Implement /api/content endpoints with tests
   - Implement /api/logs endpoint with tests
   - Set up rate limiting and security middleware

4. **Frontend Development Tasks** (21-30):
   - Create base layout and navigation components
   - Implement homepage with all sections
   - Create contact form component with validation
   - Create newsletter signup component
   - Implement Privacy Policy page [P]
   - Implement Terms & Conditions page [P]
   - Add responsive design and mobile menu
   - Implement error boundaries and 404 page
   - Add SEO metadata and sitemap
   - Performance optimization and monitoring

**Ordering Strategy**:
- TDD order: Tests written before implementation
- Dependency order: Infrastructure → Libraries → API → Frontend
- Parallel tasks marked with [P] for concurrent execution
- Critical path: Database → API contracts → Frontend integration

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*