require('dotenv').config();
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import DatabaseManager from './data/database';
import { csvDownloader } from './data/csvDownloader';
import { Command } from './types/command';

const token = process.env.DISCORD_TOKEN;

console.log('Bot is starting...');

async function initializeBot() {
    // Initialize the database
    const dbManager = new DatabaseManager();
    try {
        console.log('Creating the database...');
        await dbManager.createDB();
        console.log('Database created successfully.');
    } catch (error) {
        console.error('Failed to initialize the database:', error);
        process.exit(1); // Exit if the database fails to initialize
    } finally {
        dbManager.close();
    }

    // Download the CSV data
    try {
        console.log('Running the CSV downloader...');
        await csvDownloader();
        console.log('CSV downloader finished.');
    } catch (error) {
        console.error(
            'An error occurred while running the CSV downloader:',
            error,
        );
        process.exit(1); // Exit if the CSV download fails
    }

    // Initialize the Discord client
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    client.commands = new Collection<string, Command>();

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
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
            }
        }
    }

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(
            interaction.commandName,
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    });

    client.login(token);
}

// Start the initialization process
initializeBot();
