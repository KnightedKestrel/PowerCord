import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import { getEmbedColor, getEmbedFooter } from '../../constants/embed';
import { api } from '../../data/api';
import { Meet } from '../../types/types';
import logger from '../../utils/logger';

async function fetchMeet(name: string): Promise<Meet | undefined> {
    return api.getMeet(name);
}

function compareDots(a: Meet['entries'][0], b: Meet['entries'][0]): number {
    if (!a.dots && !b.dots) return 0;
    if (!a.dots) return 1;
    if (!b.dots) return -1;
    return b.dots - a.dots;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meet')
        .setDescription(`Displays meet's top lifters with pagination`)
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Name of the meet')
                .setRequired(true),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const name = interaction.options.getString('name');
            if (!name) {
                await interaction.editReply('You need to specify a meet.');
                return;
            }

            const meet: Meet | undefined = await fetchMeet(name);

            if (!meet || meet.entries.length === 0) {
                await interaction.editReply(`No data found for meet: ${name}.`);
                return;
            }

            const entries = meet.entries.sort(compareDots);

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor())
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription(`Top lifters for **${meet.name}**, page 1`)
                .setFooter({ text: getEmbedFooter() });

            const pageSize = 5;
            const maxPages = Math.ceil(entries.length / pageSize);
            let currentPage = 1;

            const updateFields = (page: number) => {
                const offset = (page - 1) * pageSize;
                const pageEntries = entries.slice(offset, offset + pageSize);
                const fields = pageEntries.flatMap((entry, index) => [
                    {
                        name: `\`${offset + index + 1}.\` ${entry.name}`,
                        value: `Squat: ${entry.squat} | Bench: ${entry.bench} | Deadlift: ${entry.deadlift}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `Total: ${entry.total} | Dots: ${entry.dots ? entry.dots.toFixed(2) : '—'}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true,
                    },
                ]);
                embed.setFields(fields);
                embed.setDescription(
                    `Top lifters for **${meet.name}**, page ${page}`,
                );
            };

            updateFields(1);

            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(maxPages <= 1),
            );

            await interaction.editReply({
                embeds: [embed],
                components: [buttons],
            });

            const message = await interaction.fetchReply();

            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 60000,
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (i.customId === 'next' && currentPage < maxPages) {
                    currentPage++;
                } else {
                    return;
                }

                updateFields(currentPage);
                buttons.components[0].setDisabled(currentPage === 1);
                buttons.components[1].setDisabled(currentPage === maxPages);

                await i.update({ embeds: [embed], components: [buttons] });
            });

            collector.on('end', () => {
                buttons.components.forEach((button) =>
                    button.setDisabled(true),
                );
                interaction.editReply({ components: [buttons] });
            });
        } catch (error) {
            logger.error('Error executing /meet command:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'An error occurred while fetching the meet data.',
                });
            } else {
                await interaction.reply({
                    content: 'An error occurred while fetching the meet data.',
                    ephemeral: true,
                });
            }
        }
    },
};
