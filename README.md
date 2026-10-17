# Hebrew Learning

**A full-stack Hebrew vocabulary and grammar learning platform for Russian-speaking learners.**

[Live website](https://hebrewlearning.co.il/) · [Backend repository](https://github.com/RozhR/hebrew-backend) · [Initial release: v1.0.0](https://github.com/RozhR/hebrew-redux-toolkit/tree/v1.0.0)

Hebrew Learning combines vocabulary flashcards, timed quizzes, grammar practice and personal progress tracking in a Russian-language interface. The application has a React/TypeScript frontend, an Express API and a PostgreSQL database.

## Features

- **1,300 Hebrew words:** 500 verbs, 500 adjectives and 300 adverbs.
- **65 vocabulary levels:** 25 verb levels, 25 adjective levels and 15 adverb levels, each containing 20 words.
- **Interactive flashcards:** reveal translations, shuffle cards and practice vocabulary level by level.
- **Timed vocabulary tests:** four answer options, 15 seconds per question and an **85%** score required to unlock the next level.
- **Hebrew grammar:** verb conjugations across tenses, adjective forms and exercises for selected words.
- **Personal learning progress:** statistics, unlocked levels and saved grammar selections for signed-in users.
- **Authentication:** registration and login with user-specific data stored in PostgreSQL.
- **Guest mode:** access to the first vocabulary level without an account.
- **Admin analytics:** a role-protected dashboard with application metrics.

## How learning works

1. Choose a word category and start with the first available level.
2. Study the words using interactive cards and check their translations.
3. Complete a timed vocabulary test to assess what you have learned.
4. Unlock the next level after scoring at least 85%.
5. Explore grammar forms, practise selected verbs and review your statistics.

## Tech stack

| Layer          | Technologies                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| Frontend       | React, TypeScript (strict), Redux Toolkit, RTK Query, React Router, Vite, CSS |
| Backend        | Node.js, Express, REST API                                                    |
| Database       | PostgreSQL                                                                    |
| Authentication | JWT in an HttpOnly cookie                                                     |
| Testing        | Vitest, React Testing Library, Jest, Supertest                                |
| Deployment     | Render; Docker and Nginx for local containerized setup                        |

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
       PostgreSQL
     content + app schemas
```

The backend separates learning content (`content` schema) from application data (`app` schema). Personal progress and statistics are associated with user accounts. RTK Query handles server requests and caching, while local UI interactions remain in React state.

### Frontend structure

| Directory        | Responsibility                               |
| ---------------- | -------------------------------------------- |
| `src/api`        | API endpoints and RTK Query caching          |
| `src/components` | Pages, cards, quizzes, forms and admin views |
| `src/config`     | Categories and learning rules                |
| `src/hooks`      | Reusable progress, grammar and timer logic   |
| `src/store`      | Authentication and guest selection state     |
| `src/styles`     | Page styles and reusable design tokens       |
| `src/types`      | Shared TypeScript types                      |
| `src/utils`      | General-purpose helpers                      |

## Run locally

**Requirements:** Node.js 24, npm 11, and the backend running with a PostgreSQL database. Follow the [backend setup instructions](https://github.com/RozhR/hebrew-backend#local-setup) first.

```powershell
git clone https://github.com/RozhR/hebrew-redux-toolkit.git
cd hebrew-redux-toolkit
npm ci
npm run dev
```

Open the address printed by Vite, typically <http://localhost:5173>. During development, `/api` is proxied to <http://localhost:3000>.

Database credentials and JWT secrets must remain in the **backend environment** and must not be added to frontend source code.

## Quality checks

```powershell
npm run format:check
npm run lint
npm test
npm run build
```

At the initial v1.0.0 release checkpoint, **26 frontend tests in 13 files** passed, as did the TypeScript/Vite build. The paired backend release passed **28 tests in 4 suites**. These are historical release figures, not a claim about the latest commit.

Component tests use mocked API hooks in several places. They do not replace browser end-to-end testing or a production smoke test.

## Deployment

The public frontend runs on Render as a static site; the Node.js backend is deployed separately. The frontend production build uses `npm ci && npm run build` and publishes the `dist` directory.

- **`main`** — primary development and documentation branch.
- **`deploy`** — production branch used by the frontend Render service.
- **`v1.0.0`** — immutable tag for the initial public release (12 October 2026).

The frontend Render service is configured for **manual deployment**. Pushing to `deploy` alone does not publish a new frontend version; a deployment must be triggered in Render. The backend has its own deployment configuration.

For local Docker deployment, keep `hebrew-redux-toolkit` and `hebrew-backend` side by side and follow the [backend Docker instructions](https://github.com/RozhR/hebrew-backend#local-docker-setup). The containerized frontend is served on <http://localhost:8080>.

## Limitations and next steps

Vocabulary and grammar answers are graded in the browser. The API checks submitted totals and progression rules but does **not** independently verify each answer, so test results should not be treated as trusted examinations.

Future work includes usability improvements, expanded accessibility checks, additional automated end-to-end coverage and ongoing improvements based on real learner feedback.

## Project links

- **Website:** https://hebrewlearning.co.il/
- **Frontend:** https://github.com/RozhR/hebrew-redux-toolkit
- **Backend:** https://github.com/RozhR/hebrew-backend
