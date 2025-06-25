import logger from './logger';

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const clientId = process.env.CLIENT_ID;
const discordToken = process.env.DISCORD_TOKEN;

const commands = [];
// Grab all the command folders from the commands director
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all command files from the commands directory
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file: string) => file.endsWith('.ts'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            logger.warn(
                `The command at ${filePath} is missing a required "data" or "execute" property.`,
            );
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(discordToken);

// Deploy commands
(async () => {
    try {
        logger.info(
            `Started refreshing ${commands.length} application (/) commands.`,
        );

        // Register slash commands globally
        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });

        logger.info(
            `Successfully reloaded ${data.length} application (/) commands.`,
        );
    } catch (error) {
        logger.error('Error refreshing commands: ', error);
    }
})();
