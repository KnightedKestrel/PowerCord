<img width="125" height="125" align="left" style="float: left;" alt="PowerCord logo" src="PowerCord.png">
<!-- Extra padding in image because GitLab ignores margin styling -->

# PowerCord

PowerCord is a Discord bot that displays powerlifting meet data from https://www.openpowerlifting.org/.

[![Node JS](https://img.shields.io/badge/node.js-23.2.0-brightgreen.svg)](https://nodejs.org/en/)
[![Discord JS](https://img.shields.io/badge/discord.js-14.16.3-orange.svg)](https://discord.js.org/)
[![Invite to Discord server](https://img.shields.io/badge/discord-invite%20to%20server-5865F2?logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=1306740469484486697&permissions=0&scope=bot%20applications.commands)

## Setup

Project requires [Node.js](https://nodejs.org/) to run. After installing, it is recommended to use [NVM](https://github.com/nvm-sh/nvm) ([installation guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)) to manage node versions and stay up to date. No other system level dependencies are needed.

### Environment

This project uses [dotenv](https://github.com/motdotla/dotenv#readme) to manage environment-specific settings. Rename the `.env.example` file in the `bot` directory to `.env` and enter in the necessary values listed inside the file. If you do not have a token yet, check out [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

⚠️ Keep the Discord token to yourself at all costs.

### Project

In the root directory of the project enter the following commands. This will install all dependencies and begin the dev instance.

```sh
npm install:all
npm run dev
```

To run the Discord bot or web client individually, enter either the `bot` or `web` directory and run:

```sh
npm install
npm run dev
```