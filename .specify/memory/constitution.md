<!--
Sync Impact Report:
- Version change: none (unfilled template) → 1.0.0
- Modified principles: n/a (first generation)
- Added sections:
  - Core Principles I–XXI (engineering root + frontend + frontend-platform)
  - Design System Integration
  - Microfrontend Principles
  - Quality Standards
  - Project Stack and Constraints
  - Development Workflow
  - Governance
- Removed sections: all template placeholders
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ no change required (Constitution Check reads this file)
  - .specify/templates/spec-template.md: ⚠ pending — engineering specs MUST open with the
    "Inheritance from Product Spec" section (Principle V); template does not include it yet
  - .specify/templates/tasks-template.md: ✅ no change required
- Follow-up TODOs:
  - TODO(TYPESCRIPT): no tsconfig.json exists and the codebase is 100% JavaScript. Principle IX
    requires new files in TypeScript with strict mode; a strict tsconfig and loader/test support
    (rspack swc-loader, vitest) MUST be added before the first new file is created.
  - TODO(TEST_LOCATION): existing tests live in src/tests/ (not colocated). New tests MUST be
    colocated; legacy tests migrate when touched (Quality Standards → Testing).
  - TODO(FILE_NAMING): component directories use PascalCase (e.g. src/components/AddModal/).
    New files/directories MUST be lowercase; legacy names migrate when touched (Principle XI).
  - TODO(DEPENDENCY_AUDIT): CI (.github/workflows/test-and-build-18.yml) does not run a
    vulnerability check; add `npm audit` (or equivalent) to satisfy Principle II.
  - TODO(BRANCH_PROTECTION): confirm GitHub branch protection on `main` (required review +
    required CI status) — cannot be verified from the repository contents.
  - TODO(COMMIT_FORMAT): recent history uses scoped types (`feat(whatsapp): …`) and subjects
    longer than 50 chars; Principle VII applies to all new commits.
  - TODO(CHANGELOG_FORMAT): CHANGELOG.md uses a custom emoji format rather than Keep a
    Changelog. This app is not a public library, so Principle VIII is SHOULD here; align on the
    next release if the team agrees.
  - TODO(API_NORMALIZATION): verify whether snake_case backend fields currently leak into
    stores/components (src/api → src/stores/modules); Principle XVIII applies to new code.

Provenance:
- Source: weni-ai/vtex-cx-engineering-constitutions (main)
- Domains: frontend-platform (extends frontend; root always applied)
- Bases: base-constitution.md, frontend/base-constitution.md, frontend-platform/base-constitution.md
-->

# Weni Integrations Webapp Constitution

Constitution for `weni-integrations-webapp`, the Integrations microfrontend of
the Weni/VTEX CX Platform. It is consumed by the host application (Connect)
through Module Federation and can also run standalone. Precedence: engineering
root > frontend > frontend platform > this project's adaptations.

## Core Principles

### I. Version Control and Review

All code MUST enter `main` through a pull request. A merge MUST require at least
one approved review (default reviewers come from `.github/CODEOWNERS`) and a
green CI run (`.github/workflows/test-and-build-18.yml`: lint, coverage, build).
Direct pushes to `main` MUST be blocked through GitHub branch protection.

**Rationale:** the policy is only real when the platform enforces it. Peer
review and a protected main branch keep history auditable and keep unreviewed
changes out of production.

### II. Security and Secrets

Secrets MUST never be committed. `.env*` files stay git-ignored; build-time
configuration is injected by the deploy pipeline (from `weni-ai/webapp-secret`)
and read only through `getEnv()` in `src/utils/env.js`. Because `rspack` inlines
`process.env` into the client bundle, server-side secrets MUST NOT be exposed as
build variables. Only public identifiers (API base URL, app IDs, DSNs) are
allowed. Access MUST follow least privilege by default. Dependencies MUST come
from trusted registries only and MUST be checked for known vulnerabilities.

**Rationale:** leaked credentials and untrusted dependencies are among the most
common and damaging breaches. Anything bundled into a browser app is public.

### III. Observability

Logs and telemetry (Sentry, LogRocket, Hotjar, `console`) MUST be structured
and MUST never contain secrets, auth tokens, or sensitive personal data. Errors
MUST be traceable across host and module boundaries through correlation or
trace identifiers. Use Sentry tags and context, following the pattern in
`src/utils/moduleFederation.js`.

**Rationale:** structured, privacy-safe telemetry makes incidents diagnosable
without creating new data-exposure risks.

### IV. Versioned Contracts

Every change to a public interface MUST be versioned with SemVer. That includes
the Module Federation exposure `integrations/main` (`mountIntegrationsApp({
containerId, initialRoute })`), the shared singletons (`vue`, `vue-i18n`), the
consumed `connect/sharedStore` shape, and the `package.json` version and
release tags (`X.Y.Z`, `X.Y.Z-staging`, `X.Y.Z-develop`). Changes MUST be
backward compatible or ship with an announced deprecation path. Silent breaking
changes MUST NOT be introduced.

**Rationale:** the host depends on a stable contract. Explicit versioning and
deprecation give it a predictable path to adapt without outages.

### V. Specification Traceability

Every engineering spec under `specs/` MUST derive from exactly one approved
product spec and MUST reference it by an immutable pinned version (commit or
tag). A mutable URL or ID alone MUST NOT be used. The product spec MUST exist
and be tagged before its engineering spec is created. An engineering spec MUST
NOT redefine the "what" it inherits: problem, scope, success criteria, and
binding decisions. Non-trivial features SHOULD have a technical architecture
document. When one exists, it MUST be linked and pinned by commit/tag, but its
absence MUST NOT block the engineering spec.

Every engineering spec MUST open with exactly this section:

```
## Inheritance from Product Spec
- Product Spec: <title> — <URL>
- Pinned version: <commit/tag>
- Architecture doc: <none | URL + commit/tag>
- Inherited binding decisions: <short list>
- Scope of this spec: <slice implemented by this repo>
- Divergences: <none | link to amendment>
```

**Rationale:** pinned traceability guarantees every team implements the same
version of a feature and keeps the link machine-checkable across repositories.

### VI. No Silent Divergence

When a technical need contradicts something inherited from the product spec
(scope, success criteria, or a binding decision), the divergence MUST NOT be
implemented silently. It MUST be raised as an amendment in the product
repository and recorded in the `Divergences` field, linking to that amendment.
Once the amendment is approved and tagged, `Pinned version` MUST be updated. A
technical difference that contradicts nothing inherited is an implementation
decision and MUST live in the engineering spec.

**Rationale:** in a federated model the product spec is the single source of
truth. Silent deviations make intent and implementation drift apart with no
audit trail.

### VII. Commit Messages

Commits MUST follow Conventional Commits: `<type>: <description>`. Allowed
types are `feat`, `fix`, `docs`, `refactor`, `test`, and `chore`. The
description MUST be imperative, specific, and no longer than 50 characters.
Commits MUST be atomic: one logical change per commit.

**Rationale:** conventional, atomic commits enable automated changelogs, SemVer
bumps, bisecting, and clean reverts.

### VIII. Changelog Maintenance

Public libraries MUST maintain a changelog in Keep a Changelog format, with
every user-facing change filed under Added, Changed, Deprecated, Removed, Fixed,
or Security, and version bumps following SemVer. This project is an application,
not a published library. It SHOULD keep `CHANGELOG.md` updated for every
release, in step with the `package.json` version and release tag.

**Rationale:** the changelog communicates impact to the host team and support,
and serves as release documentation.

### IX. Type Safety

All new files MUST be written in TypeScript with `strict` mode enabled. Changes
to existing JavaScript files SHOULD be limited to bug fixes or small changes.
Substantial modifications SHOULD include migration to TypeScript. Type
definitions MUST be explicit. `any` SHOULD be avoided except at untyped
third-party boundaries (e.g. `helphero`, `vue-avatar`).

**Rationale:** static typing catches errors at compile time, improves tooling,
and serves as inline documentation. Gradual migration avoids blocking delivery.

### X. Code as Documentation

All code MUST be written in English, including identifiers, comments, and docs.
Domain-specific terms with no translation MAY remain in their original form.
Readability MUST take precedence over brevity. Non-trivial decisions MUST be
documented with comments that explain the "why", not the "what".

**Rationale:** a globally comprehensible codebase enables cross-team and
open-source collaboration, and protects invariants future developers cannot
see.

### XI. Naming Conventions

Variables and functions MUST use `camelCase`. Components MUST use `PascalCase`.
New file and directory names MUST be lowercase. Abbreviations MUST be avoided
unless universally understood.

**Rationale:** consistent naming reduces cognitive load and enables tooling and
fast navigation.

### XII. Single Responsibility

Each file SHOULD stay under 350 lines. Each function MUST have one
responsibility. Template logic MUST be extracted to computed properties or
methods. Complex conditional rendering MUST be abstracted into descriptive
boolean variables.

**Rationale:** small, focused units are easier to test, review, and refactor.
Readable templates make a component's structure obvious.

### XIII. Component Architecture

Components MUST be named descriptively and grouped by feature under
`src/components/` (e.g. `whatsAppTemplates/`, `config/`). Prefixes SHOULD
indicate scope (`AppHeader`, `UserProfile`). Props MUST have descriptive names
(`userName`). Emitted events MUST be prefixed with `on`
(`onUserEmailChange`). State-updating methods SHOULD be prefixed with `handle`.
State variables MUST describe what they represent (`isLoadingUser`,
`errorStatusUser`). Routed pages live in `src/views/`, and reusable logic lives
in `src/composables/`.

**Rationale:** predictable component interfaces reduce integration errors and
document themselves.

### XIV. Styling Standards and BEM

CSS selectors MUST use classes only. IDs are reserved for JavaScript targeting
when there is no alternative. Nested selectors SHOULD be avoided. Class names
MUST follow BEM: blocks (`.button`), elements (`.button__text`), and modifiers
(`.button--large`). Elements MUST NOT be chained (`.block__elem1__elem2`).
Design tokens MUST replace hardcoded values (see Token Consumption).

**Rationale:** class-only, flat BEM selectors prevent specificity wars and
collisions across a large codebase and inside a shared host page.

### XV. State Management

Global state MUST be managed with Pinia stores under `src/stores/modules/`.
Persistence MUST go through `pinia-plugin-persistedstate` or `moduleStorage`.
State MUST NOT be duplicated across components or stores. Related state SHOULD
be grouped by feature module (e.g. `stores/modules/appType/`). Local component
state SHOULD be preferred when data is not shared.

**Rationale:** one source of truth per piece of state prevents synchronization
bugs and keeps data flow traceable.

### XVI. Async State Correctness

Async operations MUST track loading, success, and error states consistently.
Silent failures MUST NOT occur. Errors MUST be surfaced to the user (e.g.
Unnnic alerts) or reported to Sentry. Contradictory states (loading and error at
the same time) MUST be prevented. Double submissions MUST be guarded against. A
failed optimistic update MUST roll back.

**Rationale:** incorrect async state is a leading source of bugs and broken UX.
Users must always know what is happening.

### XVII. API Integration

HTTP calls MUST be encapsulated in service modules under `src/api/`, using the
shared client in `src/api/request.js`, and MUST NOT be issued from components.
Error handling MUST be explicit. API errors MUST NOT surface as unhandled
exceptions. Loading and error states MUST be reflected in the UI.

**Rationale:** separating transport from presentation enables reuse and
testing, and keeps components focused on rendering.

### XVIII. API and Data Boundaries

Backend contracts (Weni Integrations Engine) MUST stay at the API/service
boundary. Internal code MUST use camelCase, and snake_case backend fields MUST
be normalized in the adapter layer. Raw backend fields MUST NOT leak into
stores, business logic, or components. DTOs that intentionally mirror the
backend contract MAY keep backend naming.

**Rationale:** clean boundaries decouple the UI from backend implementation
details and keep the codebase consistent.

### XIX. Semantic HTML

Markup MUST use semantic elements (`header`, `nav`, `main`, `section`,
`article`, `aside`, `footer`) wherever they apply. `div` and `span` MUST only be
used when no semantic alternative exists. Headings MUST follow a logical
hierarchy, and every page (`src/views/`) MUST have exactly one `h1`. Elements
SHOULD carry at least one descriptive class, even when unstyled.

**Rationale:** semantic HTML improves assistive-technology support and makes
markup self-documenting. Heading hierarchy is critical for screen-reader
navigation.

### XX. Defensive Programming

Defensive guards (null checks, fallbacks, runtime assertions) SHOULD only be
added when the invalid state is realistically reachable. Module Federation
boundaries (`safeImport`, `safeAsyncComponent`) are a reachable case. Root
causes MUST be fixed rather than masked. Guards MUST follow the patterns
already used in the surrounding code.

**Rationale:** unnecessary guards obscure real logic. Fixing root causes yields
more robust code.

### XXI. Maintainability

Business rules MUST NOT be duplicated across locations. They MUST be
centralized in one source of truth (e.g. `src/utils/apps.js` for app-type
rules). Local duplication of utility code MAY exist when extraction would create
unnecessary coupling. Abstractions SHOULD only be created when a clear pattern
spans multiple use cases.

**Rationale:** premature abstraction creates coupling worse than the
duplication it removes. Centralize rules and tolerate incidental duplication.

## Design System Integration

### Component Usage

UI primitives MUST come from Unnnic (`@weni/unnnic-system`, registered in
`src/utils/plugins/UnnnicSystem.js`) when available. Custom components MUST NOT
duplicate design-system functionality. Unnnic updates MUST be adopted through
controlled version bumps in `package.json`, never through copy-pasted code. The
Unnnic skill MUST be consulted for components, props, tokens, and usage
patterns.

**Rationale:** a shared library guarantees visual consistency, reduces
duplication, and centralizes accessibility fixes.

### Deprecated Components

Legacy Unnnic components MUST NOT be introduced in new code when a modern
alternative exists, as documented by the Unnnic skill. Existing usages SHOULD
be migrated when the surrounding code is modified.

**Rationale:** deprecated components will be removed. Preventing new usages
limits migration scope.

### Token Consumption

Color, typography, spacing, shadow, and radius values MUST reference Unnnic
SCSS tokens, which are auto-injected into every `.scss`/`.sass` file by
`rspack.config.cjs`. Raw values MUST NOT be used. Semantic tokens MUST be
preferred over primitive tokens. Tokens MUST NOT be invented; only documented
tokens are valid.

**Rationale:** tokens decouple design decisions from code, enabling global
visual changes without hunting through files.

## Microfrontend Principles

### Isolation

The module MUST NOT pollute the host's global scope: no unscoped global styles,
no globals on `window`, and no unprefixed storage keys. Component styles MUST
be `scoped` or BEM-prefixed. Browser storage MUST go through `moduleStorage`
(prefix `integrations_`) in `src/utils/storage.js`. Global event listeners,
timers, and observers MUST be removed on unmount.

**Rationale:** isolation prevents interference with Connect and other modules,
and keeps this module independently deployable and testable.

### Communication

The module MUST communicate with the host only through its documented contract:
the `mountIntegrationsApp` entry point (`src/main.js`), the
`connect/sharedStore` remote (auth token and current project), and the shared
singletons. Remote imports MUST go through `safeImport` / `safeAsyncComponent`
in `src/utils/moduleFederation.js`. Direct DOM manipulation outside the
module's mount container MUST NOT occur.

**Rationale:** explicit contracts make integration predictable and let host
and module evolve independently.

## Quality Standards

### Linting and Formatting

All code MUST pass `npm run lint` (ESLint flat config extending
`@weni/eslint-config/vue3.js`) with no errors before merge. Formatting MUST be
enforced by Prettier (`.prettierrc.cjs`, `npm run format`). Style debates MUST
NOT happen in code review.

**Rationale:** a shared, automated configuration guarantees a uniform codebase
across Weni frontends.

### Testing

Components and stores with business logic MUST have unit tests, using Vitest,
`@vue/test-utils`, and jsdom, with `miragejs`/fakes for API data. New tests
MUST be colocated with the code they test in a `__tests__/` subdirectory.
Existing tests in `src/tests/` SHOULD be moved next to their subject when that
code is modified. Tests MUST verify behavior, not implementation details. Tests
MUST NOT be added only to raise coverage. A test that would still pass after a
regression MUST be fixed or removed.

**Rationale:** colocated, behavior-focused tests survive refactors and catch
real bugs. Coverage-only tests give false confidence.

### Accessibility

Interactive elements MUST be keyboard accessible. Form inputs MUST have
associated labels. Color MUST NOT be the only means of conveying information.
Images MUST have meaningful `alt` text or `alt=""` when decorative. Focus
states MUST be visible.

**Rationale:** accessibility is a legal requirement in many jurisdictions and
improves usability for everyone.

### Performance

Unused dependencies MUST be removed. Heavy computations on frequent events MUST
be memoized or debounced (`lodash.debounce` / `lodash.throttle`). Assets in
`src/assets/` MUST be optimized. Bundle-size impact SHOULD be weighed before
adding dependencies. Initial load SHOULD prioritize above-the-fold content, and
routes SHOULD be lazy-loaded.

**Rationale:** the module loads inside the host, so its weight adds directly to
the platform's load time.

### Internationalization

User-facing strings MUST NOT be hardcoded. They MUST live in `src/locales/`,
with `en.json` as the Crowdin source and `pt_br`, `es_es`, and `ro_ro` as
translations. Dates, numbers, and currency MUST be formatted for the user's
locale. Locale files SHOULD keep key parity. New strings MUST be added to the
locale files before merge. Translation is completed through the Crowdin and
localization-ticket workflows.

**Rationale:** externalized strings enable translation without code changes,
and locale-aware formatting builds trust with international users.

## Project Stack and Constraints

- **Runtime**: Vue 3 (Composition and Options API), Vue Router 4, Pinia 3,
  vue-i18n 10, Axios, Sass. Node 18 in CI.
- **Build**: Rspack with Module Federation (`name: integrations`, exposes
  `./main`, remote `connect`). Vite is used only for `preview`.
- **Design system**: `@weni/unnnic-system`.
- **Testing**: Vitest + `@vue/test-utils` + jsdom. Coverage is reported to
  Codecov.
- **Telemetry**: Sentry (`USE_SENTRY`, `SENTRY_DSN`), LogRocket, Hotjar.
- **Delivery**: Docker image built by GitHub Actions on tag push. `-develop` and
  `-staging` suffixes select the environment, and plain `X.Y.Z` is production.
  Manifests are updated in `weni-ai/kubernetes-manifests-platform`.
- New dependencies MUST be justified in the PR description (purpose, size,
  maintenance status).

## Development Workflow

- PRs MUST follow `.github/pull_request_template.md` (Type of Change, Why, What
  Changed, plus a Diagram or Demonstration when helpful).
- CI gates (lint → coverage → build) MUST be green before merge.
- Feature work SHOULD go through the Speckit flow (`specify` → `plan` →
  `tasks` → `implement`). The plan's Constitution Check MUST pass or document
  justified violations in Complexity Tracking.
- Releases MUST bump `package.json` per SemVer, update `CHANGELOG.md`, and be
  tagged per the delivery rules above.

## Governance

This constitution supersedes conflicting local practices. Content precedence
is engineering root > frontend > frontend platform > project adaptations. A
project adaptation MAY narrow a rule but MUST NOT weaken a MUST without an
explicit, justified exception recorded in the affected principle.

Amendments MUST be proposed through a pull request that updates this file and
its Sync Impact Report. Changes that originate in the base constitutions
(`weni-ai/vtex-cx-engineering-constitutions`) MUST be pulled in by re-running
`setup-engineering`, which preserves the project exceptions that still apply.
Versioning follows SemVer: MAJOR for removing or redefining a principle, MINOR
for adding a principle or section, and PATCH for clarifications.

Compliance is checked in every PR review and in each plan's Constitution Check.
`/speckit.analyze` treats any conflict with a MUST as CRITICAL.

**Version**: 1.0.0 | **Ratified**: 2026-10-01 | **Last Amended**: 2026-10-01
