# Copilot Instructions for PowerCord

## Core Requirements

- Prioritize stability, speed, and user experience.

## Code Quality

- Use TypeScript everywhere (including the Discord bot and all Vue components).
- For Vue, always use `<script setup lang="ts">` and the composition API.
- Use Prettier and ESLint for formatting and linting.
- Code must conform to the project's ESLint and Prettier rules strictly.
- Always use the `logger` utility for logging (never use `console.log`, `console.error`, etc.).
- Use clear, descriptive names for variables and functions.
- Add comments only for complex or non-obvious logic.
- Keep functions focused and under 50 lines; extract complex logic to separate files.
- Remove unused code.
- Use consistent error handling patterns.

## Project Structure

- This is a monorepo: `bot` (TypeScript, better-sqlite3) and `web` (Vue, Nuxt 3, Tailwind) are fully isolated.
- Each project has its own `/test` directory for Vitest tests. No tests or build logic at the root.
- Never edit the root LICENSE. Only change root files for new, widely-accepted best practices.

## Testing & Coverage

- Write unit tests for core logic using Vitest. Place all tests in the `/test` directory of each project.
- Do not aggregate or run tests from the root.
- Code coverage is combined in CI for Codecov.

## Security & Environment

- Never commit secrets or tokens. Use `.env` files for all environment variables. `.env` files must be in `.gitignore`.

## CI/CD & Deployment

- CI runs Prettier, ESLint, tests, and builds for both projects. All PRs are checked against this workflow.
- Web is deployed by Vercel on `/web` changes to master. Bot is deployed manually to Digital Ocean and managed with pm2. Logs go to Better Stack.

## General Guidance

- Keep code readable for junior developers.
- Never generate or suggest code that would commit secrets or tokens.
- Always follow the [CONTRIBUTING.md](../CONTRIBUTING.md) guide for PRs.
