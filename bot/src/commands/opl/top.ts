import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import { getEmbedColor, getEmbedFooter } from '../../constants/embed';
import { config } from '../../utils/config';
import { TopLifter } from '../../types/types';
import logger from '../../utils/logger';

let cachedTopLifters: TopLifter[] | null = null;

async function getTopLifters(forceRefresh: boolean = false): Promise<TopLifter[] | undefined> {
    if (cachedTopLifters && !forceRefresh) {
        return cachedTopLifters;
    }

    try {
        const response = await fetch(`${config.API_BASE_URL}/top`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const freshData = await response.json();

        if (freshData) {
            cachedTopLifters = freshData;
            if (forceRefresh) {
                logger.info('Top lifters cache updated in background');
            }
        }

        return cachedTopLifters || undefined;
    } catch (error) {
        logger.error('Error fetching top lifters:', error);
        return cachedTopLifters || undefined;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Display top ranked lifters'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const allTopLifters: TopLifter[] | undefined = await getTopLifters();

            if (!allTopLifters || allTopLifters.length === 0) {
                await interaction.editReply('No data found for top lifters.');
                return;
            }

            const pageSize = 5;
            const maxPages = Math.ceil(allTopLifters.length / pageSize);
            let currentPage = 1;

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor())
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription(`Top lifters sorted by dots - Page ${currentPage} of ${maxPages}`)
                .setFooter({ text: getEmbedFooter() });

            const updatePage = (page: number) => {
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const pageLifters = allTopLifters.slice(startIndex, endIndex);

                const fields = pageLifters.flatMap((lifter, index) => [
                    {
                        name: `\`${startIndex + index + 1}.\` ${lifter.name} (${lifter.sex})`,
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

                embed.setFields(fields);
                embed.setDescription(`Top lifters sorted by dots - Page ${page} of ${maxPages}`);
            };

            updatePage(currentPage);

            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === maxPages),
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
                try {
                    if (i.customId === 'prev' && currentPage > 1) {
                        currentPage--;
                    } else if (i.customId === 'next' && currentPage < maxPages) {
                        currentPage++;
                    } else {
                        return;
                    }

                    updatePage(currentPage);
                    buttons.components[0].setDisabled(currentPage === 1);
                    buttons.components[1].setDisabled(currentPage === maxPages);

                    await i.update({ embeds: [embed], components: [buttons] });
                } catch (error) {
                    logger.error('Error handling pagination interaction:', error);
                }
            });

            collector.on('end', () => {
                try {
                    buttons.components.forEach((button) =>
                        button.setDisabled(true),
                    );
                    interaction.editReply({ components: [buttons] });
                } catch (error) {
                    logger.error('Error disabling buttons on collector end:', error);
                }

                getTopLifters(true);
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
