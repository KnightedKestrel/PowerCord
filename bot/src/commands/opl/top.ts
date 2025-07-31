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
import { TopLifter } from '../../types/types';
import logger from '../../utils/logger';

async function fetchTopLifters(
    page: number = 1,
): Promise<TopLifter[] | undefined> {
    return api.getTopLifters(page);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Display top ranked lifters'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const topLifters: TopLifter[] | undefined = await fetchTopLifters();

            if (!topLifters || topLifters.length === 0) {
                await interaction.editReply('No data found for top lifters.');
                logger.error('Error getting top lifters.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor())
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription('Top lifters sorted by dots')
                .setFooter({ text: getEmbedFooter() });

            const fields = topLifters.flatMap((lifter, index) => [
                {
                    name: `\`${index + 1}.\` ${lifter.name} (${lifter.sex})`,
                    value: `squat: ${lifter.squat} | bench : ${lifter.bench} | deadlift: ${lifter.deadlift}`,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `total: ${lifter.total} | dots: ${(lifter.dots || 0).toFixed(2)}`,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `\u200B`,
                    inline: true,
                },
            ]);

            embed.addFields(fields);

            const maxPages = 4;
            let currentPage = 1;

            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary),
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

                const newLifters = await fetchTopLifters(currentPage);

                if (!newLifters || newLifters.length === 0) {
                    logger.error('Error getting page for top lifters.', {
                        'Page Number': currentPage,
                        'Fetched Top Lifters': newLifters,
                    });
                    return;
                }

                const newFields = newLifters.flatMap((lifter, index) => [
                    {
                        name: `\`${(currentPage - 1) * 5 + index + 1}.\` ${lifter.name} (${lifter.sex})`,
                        value: `squat: ${lifter.squat} | bench : ${lifter.bench} | deadlift: ${lifter.deadlift}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `total: ${lifter.total} | dots: ${(lifter.dots || 0).toFixed(2)}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true,
                    },
                ]);

                embed.setFields(newFields);
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
            logger.error('Error executing /top command:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content:
                        'An error occurred while fetching the top lifters.',
                });
            } else {
                await interaction.reply({
                    content:
                        'An error occurred while fetching the top lifters.',
                    ephemeral: true,
                });
            }
        }
    },
};
