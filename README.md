<p align="center">
    <img width="125" height="125" alt="PowerCord logo" src="PowerCord.png">
    <h1 align="center">PowerCord</h1>
</p>

<p align="center">
    <a href="https://github.com/KnightedKestrel/PowerCord/actions/workflows/ci.yml"><img src="https://github.com/KnightedKestrel/PowerCord/actions/workflows/ci.yml/badge.svg" alt="CI Status"/></a>
    <a href="https://github.com/KnightedKestrel/PowerCord/actions/workflows/bot-deploy.yml"><img src="https://github.com/KnightedKestrel/PowerCord/actions/workflows/bot-deploy.yml/badge.svg" alt="Bot deployment status" /></a>
    <a href="https://powercord-gilt.vercel.app/"><img src="https://vercelbadge.vercel.app/api/KnightedKestrel/PowerCord" alt="Web deployment status" /></a>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/node.js-24.2.0-brightgreen.svg" alt="Node JS" /></a>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/discord.js-14.19.3-orange.svg" alt="Discord JS" /></a>
    <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4" alt="Code style: Prettier" /></a>
    <a href="https://discord.com/api/oauth2/authorize?client_id=1306740469484486697&permissions=0&scope=bot%20applications.commands"><img src="https://img.shields.io/badge/discord-invite%20to%20server-5865F2?logo=discord&logoColor=white" alt="Invite to Discord Server" /></a>
</p>

<p align="center">
    View meet data from <a href="https://www.openpowerlifting.org/">OpenPowerlifting.org</a> in Discord.
</p>

## Setup

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

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).
