<p align="center">
    <img width="125" height="125" alt="PowerCord logo" src="PowerCord.png">
    <h1 align="center">PowerCord</h1>
</p>

<p align="center">
    <a href="https://github.com/KnightedKestrel/PowerCord/actions/workflows/ci.yml"><img src="https://github.com/KnightedKestrel/PowerCord/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
    <!-- Get bot deployments working before showing -->
    <!-- <a href="https://github.com/KnightedKestrel/PowerCord/actions/workflows/bot-deploy.yml"><img src="https://github.com/KnightedKestrel/PowerCord/actions/workflows/bot-deploy.yml/badge.svg" alt="Bot deployment status" /></a> -->
    <a href="https://powercord-gilt.vercel.app/"><img src="https://vercelbadge.vercel.app/api/KnightedKestrel/PowerCord" alt="Web Deployment Status" /></a>
    <a href="https://codecov.io/gh/KnightedKestrel/PowerCord"><img src="https://codecov.io/gh/KnightedKestrel/PowerCord/graph/badge.svg?token=04DYKZJMH3" alt="Codecov Coverage"/></a>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/discord.js-14.20.0-orange.svg" alt="Discord JS" /></a>
    <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4" alt="Code style: Prettier" /></a>
    <a href="https://discord.com/api/oauth2/authorize?client_id=1306740469484486697&permissions=0&scope=bot%20applications.commands"><img src="https://img.shields.io/badge/discord-invite%20to%20server-5865F2?logo=discord&logoColor=white" alt="Invite to Discord Server" /></a>
    <a href="https://volta.net/KnightedKestrel/PowerCord"><img src="https://private-user-images.githubusercontent.com/25458428/473125356-ca21819b-7d8b-4d4b-852b-88446a360281.svg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTM5ODYwNzUsIm5iZiI6MTc1Mzk4NTc3NSwicGF0aCI6Ii8yNTQ1ODQyOC80NzMxMjUzNTYtY2EyMTgxOWItN2Q4Yi00ZDRiLTg1MmItODg0NDZhMzYwMjgxLnN2Zz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MzElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzMxVDE4MTYxNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWY5ZWYyMmJlODIyOGMyZmY5ZTRkYTExN2FmZDcxM2NhZjYwMDRiZjlmZTA4OWVhZDNmODBlZTkzZjYyNDM4NjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.jttvthDCcuEZuZChuaR7dFwMhEQEW5cjhCPgypnSn10" alt="Open Volta board" /></a>
</p>

> [!CAUTION]
> Major refactor taking place. OpenPowerlifting.org integration temporarily removed while refining features with mock data. This is an in-development project and the public bot will be updated when first major release is ready.

<p align="center">
    View meet data from <a href="https://www.openpowerlifting.org/">OpenPowerlifting.org</a> in Discord.
</p>

## 🚀 Setup

Project requires [Node.js](https://nodejs.org/) to run. After installing, it is recommended to use [NVM](https://github.com/nvm-sh/nvm) ([installation guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)) to manage Node versions. To set the Node version used by the project, run `nvm use` from root and follow the prompts, especially if that version has not been installed yet.

No other system level dependencies are needed.

### Environment

This project uses [dotenv](https://github.com/motdotla/dotenv#readme) to manage environment-specific settings. Rename the `.env.example` file in the `bot` directory to `.env` and enter in the necessary values listed inside the file. If you do not have a token yet, check out [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

> [!WARNING]
> Keep the Discord token to yourself at all costs.

### Project

In the root directory of the project enter the following commands. This will install all dependencies and begin the dev instance.

```sh
npm run install:all
npm run dev
```

To run the Discord bot or web client individually, enter either the `bot` or `web` directory and run:

```sh
npm install
npm run dev
```

## 🧱 Contribute

[See contributing guide](CONTRIBUTING.md).
