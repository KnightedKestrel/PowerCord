<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="PowerCord logo" src="src/assets/logo.png">

# PowerCord

PowerCord is a Discord bot that displays data fetched from https://www.openpowerlifting.org/. Made using the [discord.js](https://discord.js.org/) library.

[![Node JS](https://img.shields.io/badge/node.js-23.2.0-brightgreen.svg)](https://nodejs.org/en/)
[![Discord JS](https://img.shields.io/badge/discord.js-14.16.3-orange.svg)](https://discord.js.org/)

## Setup

Project requires [Node.js](https://nodejs.org/) to run. After installing, it is recommended to use [NVM](https://github.com/nvm-sh/nvm) ([installation guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)) to manage node versions and stay up to date.

In the root directory of the project run:

```sh
npm install
npm run dev
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
