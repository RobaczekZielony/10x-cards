# 10x-cards

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

10x-cards is a web application that enables users to quickly create and manage sets of educational flashcards. Leveraging AI via LLM models, users can automatically generate flashcard suggestions from arbitrary text, reducing the time and effort required for manual creation.

## Tech Stack

- **Frontend**
  - Astro 5
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - Shadcn/ui
- **Backend**
  - Supabase (PostgreSQL, Auth)
- **AI Integration**
  - Openrouter.ai (LLM access)
- **CI/CD & Hosting**
  - GitHub Actions
  - DigitalOcean (Docker)

## Getting Started

### Prerequisites

- Node.js **v22.14.0** (managed via `.nvmrc`)
- npm (or yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RobaczekZielony/10x-cards
   ```
2. Navigate into the project directory:
   ```bash
   cd 10x-cards
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root with the following variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and go to `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm run preview` – Preview the production build.
- `npm run astro` – Run Astro CLI.
- `npm run lint` – Run ESLint on all files.
- `npm run lint:fix` – Run ESLint with automatic fixes.
- `npm run format` – Format code with Prettier.

## Project Scope

### In Scope

- **Automatic Flashcard Generation**: Paste text and receive AI-generated flashcards.
- **Manual Flashcard Management**: Create, edit, and delete flashcards.
- **User Authentication**: Registration, login, and secure access (using Supabase).
- **Study Sessions**: Spaced repetition via a third-party review algorithm.
- **Scalable Storage**: Flashcard and user data stored in Supabase.
- **Generation Statistics**: Track AI-generated vs. accepted flashcards.
- **GDPR Compliance**: Data access and deletion functionality.

### Out of Scope (MVP)

- Custom review algorithms
- Gamification
- Mobile applications
- Document import (PDF, DOCX)
- Public API
- Flashcard sharing
- Advanced notifications
- Sophisticated keyword search

## Project Status

This project is currently in **MVP development**.
It is designed to onboard 100 active users within the first three months and will evolve based on user feedback.

## License

This project is licensed under the **MIT License**.