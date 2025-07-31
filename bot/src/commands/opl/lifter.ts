import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from 'discord.js';
import { getEmbedColor, getEmbedFooter } from '../../constants/embed';
import { api } from '../../data/api';
import { Lifter } from '../../types/types';
import logger from '../../utils/logger';

async function fetchLifter(name: string): Promise<Lifter | undefined> {
    return api.getLifter(name);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lifter')
        .setDescription(`Displays lifter's last 10 meets`)
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName('name')
                .setDescription('The name of the lifter')
                .setRequired(true),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const name = interaction.options.getString('name');
            if (!name) {
                await interaction.editReply(
                    'You need to specify a lifter name.',
                );
                return;
            }

            const lifter: Lifter | undefined = await fetchLifter(name);

            if (!lifter || lifter.meets.length === 0) {
                await interaction.editReply(
                    `No data found for lifter: ${name}.`,
                );
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor())
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription(`Last 5 meets for **${lifter.name}**, sorted by Dots`)
                .setFooter({ text: getEmbedFooter() });

            const fields = lifter.meets.flatMap((meet, index) => [
                {
                    name: `\`${index + 1}.\` ${meet.federation} ${meet.name}`,
                    value: `
                    ${meet.place}st Place, ${meet.place}
                    Date: ${meet.date}
                    Age: ${meet.age}
                    Equip: ${meet.equipment}
                    Class: ${meet.weightClass}
                    Weight: ${meet.bodyWeight}`,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `\`\`\`Squat: ${meet.squat}\nBench: ${meet.bench}\nDead: ${meet.deadlift}\n\nTotal: ${meet.total}\nDOTS: ${meet.dots}\`\`\``,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `\u200B`,
                    inline: true,
                },
            ]);

            embed.addFields(fields);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing /lifter command:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content:
                        'An error occurred while fetching the lifter data.',
                });
            } else {
                await interaction.reply({
                    content:
                        'An error occurred while fetching the lifter data.',
                    ephemeral: true,
                });
            }
        }
    },
};
