# Hebrew Learning

A web application for learning Hebrew vocabulary and grammar.

The project is built with React, TypeScript, Redux Toolkit and Vite. It includes vocabulary cards, level-based testing, progress tracking, grammar reference materials and grammar tests.

The interface is currently in Russian, while the learning content focuses on Hebrew.

## Features

- Hebrew vocabulary flashcards
- Three vocabulary categories:
    - Verbs — 25 levels
    - Adjectives — 25 levels
    - Adverbs — 15 levels
- 20 cards per level
- Card shuffle
- Flip cards with Hebrew and Russian translations
- Level-based tests with four answer options
- 15-second timer for each question
- Automatic test statistics
- Level unlocking after reaching at least 85%
- Persistent progress using `localStorage`
- Statistics by category and level
- Best and average test results
- Grammar section for selected words
- Drag-and-drop support on desktop
- Long-press support on touch devices
- Hebrew verb conjugation tables
- Grammar information for verbs, adjectives and adverbs
- Grammar tests for selected verbs
- Grammar-test statistics
- Responsive layout
- Lazy loading and code splitting for grammar pages and grammar data

## Tech Stack

### Frontend

- React
- TypeScript
- Redux Toolkit
- React Redux
- React Router
- Vite
- HTML5
- CSS3
- Responsive Design

### Development Tools

- ESLint
- Prettier
- Git
- GitHub
- npm

### Data Processing

Grammar source data is converted from Excel files into JSON using a custom Node.js conversion script.

The generated JSON files are stored in:

```text
src/data/grammar/
```

The conversion script is located at:

```text
scripts/convert-grammar-data.mjs
```

## Project Structure

```text
src/
├── components/
│   ├── grammar/
│   ├── Card.tsx
│   ├── CardList.tsx
│   ├── Grammar.tsx
│   ├── GrammarDropZone.tsx
│   ├── GrammarTest.tsx
│   ├── Home.tsx
│   ├── LearningPage.tsx
│   ├── Navbar.tsx
│   ├── Statistics.tsx
│   └── Test.tsx
│
├── config/
│   ├── categories.ts
│   └── test.ts
│
├── data/
│   ├── grammar/
│   ├── adjectives.ts
│   ├── adverbs.ts
│   └── verbs.ts
│
├── store/
│   ├── grammarSlice.ts
│   ├── grammarTestStatisticsSlice.ts
│   ├── hooks.ts
│   ├── progressSlice.ts
│   ├── statisticsSlice.ts
│   └── store.ts
│
├── styles/
│   ├── cards.css
│   ├── grammar.css
│   ├── navbar.css
│   ├── statistics.css
│   └── test.css
│
├── types/
│   └── grammar.ts
│
├── utils/
│   └── grammar/
│       ├── adjectiveGrammarData.ts
│       ├── adverbGrammarData.ts
│       └── verbGrammarData.ts
│
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

## State Management

The application uses Redux Toolkit for global state management.

The Redux store currently contains four main state areas:

```text
grammar
statistics
progress
grammarTestStatistics
```

### Grammar

Stores references to vocabulary cards selected by the user for grammar study.

### Statistics

Stores vocabulary test attempts grouped by category and level.

### Progress

Tracks the highest unlocked level for each vocabulary category.

### Grammar Test Statistics

Stores results of grammar tests.

## Persistence

The current frontend version stores user progress in browser `localStorage`.

The application validates persisted data before restoring it into Redux state.

Current storage keys:

```text
grammarWords
testStats
userProgress
grammarTestStats
```

A future full-stack version is planned to move user progress and statistics to a server-side database.

## Level Progression

Each category starts with level 1 unlocked.

To unlock the next level, the user must score at least:

```text
85%
```

on the current level test.

The application also prevents direct navigation to locked levels.

## Vocabulary Tests

Each question contains:

- one Hebrew word
- four possible translations
- one correct answer
- a 15-second timer

At the end of the test, the application calculates the result and stores the attempt in Redux.

Statistics include:

- best result
- number of attempts
- average score
- correct answers
- test date

## Grammar

Users can add vocabulary cards to the Grammar section.

Desktop users can drag cards into the grammar panel.

Touch-device users can add or remove cards using a long press.

The grammar section contains additional information depending on the word category.

### Verbs

Verb grammar includes:

- infinitive
- translation
- government
- binyan
- present tense
- past tense
- future tense
- imperative forms
- usage examples

### Adjectives

Adjective grammar includes:

- masculine singular
- feminine singular
- masculine plural
- feminine plural
- constructions
- usage examples

### Adverbs

Adverb grammar includes:

- meaning
- category
- register
- usage
- synonyms
- antonyms
- related expressions
- examples

## Grammar Tests

Selected verbs can be used to generate grammar tests.

Available sections:

```text
Present
Past
Future
Imperative
```

Users can choose:

```text
10 questions
20 questions
All available questions
```

Grammar-test attempts are stored separately and displayed on the Statistics page.

## Performance

Grammar pages are loaded using React lazy loading.

Grammar data is also split by category:

```text
verbGrammarData
adjectiveGrammarData
adverbGrammarData
```

This prevents the grammar test from loading adjective and adverb datasets when only verb data is required.

## Installation

Clone the repository:

```bash
git clone https://github.com/RozhR/hebrew-redux-toolkit.git
```

Open the project directory:

```bash
cd hebrew-redux-toolkit
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Available Scripts

Start development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Format the project:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Preview the production build:

```bash
npm run preview
```

Rebuild grammar JSON data from source files:

```bash
npm run grammar:build
```

## Quality Checks

Before committing changes, the project can be checked with:

```bash
npm run format:check
npm run lint
npm run build
```

## Current Status

Frontend v1.0 is being finalized.

Completed:

```text
HTML / CSS / JavaScript
        ↓
TypeScript
        ↓
React + TypeScript
        ↓
Redux
        ↓
Redux Toolkit
```

The current Redux Toolkit version includes vocabulary learning, testing, progress tracking, statistics, grammar content and grammar testing.

## Planned Development

The next major stage is full-stack development.

Planned additions include:

```text
Node.js
Express
PostgreSQL
Authentication
Server-side user progress
Server-side statistics
Testing
Docker
CI/CD
Deployment
```

The long-term goal is to evolve the application from a learning project into a production-ready Hebrew learning platform.

## Author

**Roman Rozhdestvenskiy**

GitHub: [RozhR](https://github.com/RozhR)
