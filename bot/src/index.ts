import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command } from './types/command';
import './deploy-commands';
import { config } from './utils/config';
import logger from './utils/logger';
import './utils/health';
import { startHeartbeat } from './utils/heartbeat';

const token = config.DISCORD_TOKEN;

logger.info('Bot is starting...');
if (config.ENABLE_MOCK_API || !config.API_BASE_URL) {
    logger.info(
        'Using mock data. Ensure that ENABLE_MOCK_API and API_BASE_URL are set for API use.',
    );
} else {
    logger.info('Retrieving API data from: ' + config.API_BASE_URL);
}

async function initializeBot() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    client.commands = new Collection<string, Command>();

    // Load commands
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file: string) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                logger.warn(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
            }
        }
    }

    // Load events
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file: string) => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    client.login(token);
    startHeartbeat();
}

initializeBot();
