# Hebrew Learning

A full-stack web application for learning Hebrew vocabulary and grammar.

The frontend is built with React, TypeScript and Redux Toolkit. Vocabulary and grammar content is loaded from a Node.js / Express API backed by PostgreSQL.

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
- Level-based vocabulary tests
- Four answer options
- 15-second timer for each question
- Level unlocking after reaching at least 85%
- Vocabulary test statistics
- Grammar section for selected words
- Drag-and-drop support on desktop
- Long-press support on touch devices
- Hebrew verb conjugation tables
- Grammar information for verbs, adjectives and adverbs
- Grammar tests for selected verbs
- Grammar-test statistics
- Responsive layout
- Lazy loading for grammar pages
- Backend API integration
- PostgreSQL-based vocabulary and grammar content

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

### Backend

The backend is maintained in a separate repository:

```text
https://github.com/RozhR/hebrew-backend