import { Events, Interaction, MessageFlags } from 'discord.js';
import logger from '../utils/logger';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName,
        );

        if (!command) {
            logger.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
