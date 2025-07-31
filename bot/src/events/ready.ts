import { Client, Events } from 'discord.js';
import logger from '../utils/logger';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        logger.info(`Ready! Logged in as ${client.user?.tag}`);
    },
};
