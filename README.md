# Hebrew Learning

A full-stack application for learning Hebrew vocabulary and grammar. The interface is in Russian; learning content is in Hebrew.

## Features

- 1,300 vocabulary words: 500 verbs, 500 adjectives and 300 adverbs.
- 25 verb levels, 25 adjective levels and 15 adverb levels, with 20 words per level.
- Flip cards, shuffle, desktop drag-and-drop and touch long-press.
- Vocabulary tests with four answer options and a 15-second timer.
- The next level opens after a saved result of at least 85%.
- Grammar tables and tests for selected verbs.
- Registration, login, profile and logout.
- User-specific statistics, progress and selected words stored in PostgreSQL.
- Guest access to the first level of each category; guest grammar selections last for the current page session.
- Error messages for failed requests and retry controls for statistics loading and grammar-test saving.

## Stack

React, TypeScript with strict checking, Redux Toolkit, RTK Query, React Router and Vite. Styling uses CSS. Tests use Vitest and React Testing Library.

The [backend](https://github.com/RozhR/hebrew-backend) uses Node.js, Express and PostgreSQL.

## Local setup

The current development branch is `testing`.

```powershell
git clone --branch testing https://github.com/RozhR/hebrew-redux-toolkit.git
cd hebrew-redux-toolkit
npm ci
npm run dev
```

Use Node.js 24 and npm 11 to match the verified installation environment. Start PostgreSQL and the backend first, following its README.

Open the URL printed by Vite, normally <http://localhost:5173>. The development proxy forwards `/api` requests to <http://localhost:3000>. The frontend does not need database credentials or a JWT secret.

## Checks

```powershell
npm run lint
npm test
npm run build
npm run format:check
```

`npm run build` checks TypeScript and writes the production assets to `dist`. `npm run test:watch` runs tests during development.

Tests cover authentication components, flashcards, statistics, grammar result saving, grammar question generation, batched requests and the actual timer lifecycle. Component tests mostly mock API hooks; they are not browser end-to-end tests.

## Structure

| Directory        | Responsibility                                     |
| ---------------- | -------------------------------------------------- |
| `src/api`        | RTK Query endpoints and server cache               |
| `src/store`      | Authentication status and guest grammar selections |
| `src/hooks`      | Timer, progress and grammar actions                |
| `src/components` | Pages and reusable UI                              |
| `src/config`     | Category rules, timers and verb-form mapping       |
| `src/types`      | Grammar types                                      |
| `src/utils`      | Shared utilities                                   |

Local UI state stays in React. Server data stays in RTK Query. Personal data is fetched only for authenticated users. Logout resets the API cache.

## Backend connection and deployment

If Vite prints `ECONNREFUSED`, check that the backend is running on port 3000. If it prints `ECONNRESET`, inspect the backend terminal at the time of failure.

The `/api` proxy in `vite.config.ts` is for development. Production hosting must route `/api` to the backend and fall back to `index.html` for frontend routes. Use HTTPS for production authentication cookies.

## Current limits

Vocabulary and grammar tests calculate correct-answer counts in the browser. The backend validates submitted totals and level access, but does not independently grade individual answers. This is a learning tracker; results should not be treated as verified exam scores.

## Local Docker setup

The Dockerfile builds the frontend with Node.js 24 and serves the resulting files through Nginx.

Nginx forwards /api/ requests to the backend and supports direct navigation to React Router pages.

Keep this repository in a directory named hebrew-redux-toolkit beside hebrew-backend. Follow the Docker setup instructions in the backend README.

After startup, open http://localhost:8080.
