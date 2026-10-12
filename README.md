# Hebrew Learning

**A full-stack platform for learning Hebrew vocabulary and grammar, designed for Russian-speaking learners.**

**[Live website](https://hebrewlearning.co.il/) · [Backend repository](https://github.com/RozhR/hebrew-backend) · [Frontend v1.0.0](https://github.com/RozhR/hebrew-redux-toolkit/tree/v1.0.0)**

The app combines interactive flashcards, timed quizzes, Hebrew grammar practice, personal progress tracking and an administrative analytics dashboard. The interface is in Russian, with Hebrew learning content.

## Highlights

- **1,300 words:** 500 verbs, 500 adjectives and 300 adverbs.
- **65 vocabulary levels:** 25 for verbs, 25 for adjectives and 15 for adverbs, with 20 words per level.
- **Interactive flashcards:** flip, shuffle, desktop drag-and-drop and touch long-press.
- **Timed vocabulary quizzes:** four options per question, 15 seconds to answer and an **85%** threshold to unlock the next level.
- **Hebrew grammar:** conjugation and adjective-form materials, selected-word practice and grammar tests.
- **Accounts and progress:** registration, login, personal statistics, level access and selected grammar words persisted in PostgreSQL.
- **Guest access:** the first vocabulary level of each category is available without signing in.
- **Admin analytics:** an access-controlled dashboard backed by administrative API endpoints.
- **Resilience:** loading/error states and retry actions for selected failed requests.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript (strict), Redux Toolkit, RTK Query, React Router, Vite, CSS |
| Backend | Node.js, Express, REST API |
| Database | PostgreSQL |
| Authentication | JWT stored in an HttpOnly cookie |
| Testing | Vitest, React Testing Library; backend Jest and Supertest |
| Deployment | Render, Docker and Nginx for local container setup |

## Architecture

```text
Browser (React + TypeScript)
        |
  Redux Toolkit / RTK Query
        |
        v
   Express REST API
        |
        v
 PostgreSQL (content + app schemas)
```

- `src/api` — RTK Query endpoints, network requests and server cache.
- `src/store` — authentication state and guest grammar selections.
- `src/hooks` — reusable timer, progress and grammar behavior.
- `src/components` — pages, flashcards, tests, authentication and administration.
- `src/config` — category configuration and learning rules.
- `src/types` — TypeScript grammar types.
- `src/utils` — shared utilities.

Local component state stays in React; remote data is managed through RTK Query. Personal server data is requested for authenticated users, and logout resets the API cache. The backend separates learning materials (`content` schema) from user accounts and progress (`app` schema).

## Run locally

Requirements: **Node.js 24**, **npm 11**, and a running backend connected to PostgreSQL. Follow the [backend setup instructions](https://github.com/RozhR/hebrew-backend#local-setup) before starting the frontend.

```powershell
git clone https://github.com/RozhR/hebrew-redux-toolkit.git
cd hebrew-redux-toolkit
npm ci
npm run dev
```

Open the address reported by Vite, usually <http://localhost:5173>. In development, Vite proxies `/api` to <http://localhost:3000>. Database credentials and the JWT secret belong **only** in the backend environment, never in frontend code.

For this repository, `main` is the primary development/documentation branch; `deploy` tracks the production application. The immutable `v1.0.0` tag identifies the initial published release.

## Quality checks

```powershell
npm run format:check
npm run lint
npm test
npm run build
```

At the v1.0.0 release checkpoint, **26 frontend tests in 13 files passed**, alongside formatting, ESLint and the TypeScript/Vite production build. The paired backend release passed **28 tests in 4 suites**.

Tests cover authentication, flashcards, statistics, grammar result persistence/retries, grammar questions and timer behavior. Most component tests use mocked API hooks; these tests do **not** replace a browser end-to-end or production smoke test.

## Deployment

The public site is deployed on Render as a static frontend, with a separately deployed Node.js backend. The frontend production build uses `npm ci && npm run build` and serves `dist`. Both deployment services currently track their `deploy` branches.

This repository also includes a **Dockerfile** and **Nginx** configuration for local containerized deployment. Keep `hebrew-redux-toolkit` beside `hebrew-backend` and follow the [backend Docker instructions](https://github.com/RozhR/hebrew-backend#local-docker-setup). The containerized app is then available at <http://localhost:8080>.

If local Vite reports `ECONNREFUSED`, verify that the backend is listening on port 3000. If it reports `ECONNRESET`, inspect the backend logs.

## Known limitations

Quiz answers are evaluated in the browser. The API validates the submitted totals and progression rules, but it does not independently grade each individual answer. Test scores are therefore suitable for learning progress, **not** trusted examinations.

This is an evolving learning product. SEO, analytics and the administrator dashboard were introduced around the initial public release; product usage and accessibility should continue to be validated with real users.

## Release

**v1.0.0 — 12 October 2026.** First public release with vocabulary learning, grammar exercises, accounts, saved progress, administrative analytics, SEO metadata and Google Analytics 4.

The live application is available at **https://hebrewlearning.co.il/**.
