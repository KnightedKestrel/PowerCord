import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
} from 'discord.js';
import DatabaseManager from '../data/database';
import logger from '../utils/logger';

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

interface TopLifter {
    Name: string;
    Sex: string;
    Squat: number;
    Bench: number;
    Deadlift: number;
    Total: number;
    Dots: number;
}

export function getTopLifters(page: number = 1): TopLifter[] {
    const db = DatabaseManager.getInstance().getDB();
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
        WITH RankedLifters AS (
            SELECT
                Name,
                Sex,
                Best3SquatKg AS Squat,
                Best3BenchKg AS Bench,
                Best3DeadliftKg AS Deadlift,
                TotalKg AS Total,
                Equipment,
                Dots,
                ROW_NUMBER() OVER (PARTITION BY Name ORDER BY Dots DESC) AS rn
            FROM entries
            WHERE
                Dots IS NOT NULL
                AND Dots != ''
                AND Equipment IN ('Raw', 'Wraps')
        )
        SELECT
            Name,
            Sex,
            Squat,
            Bench,
            Deadlift,
            Total,
            Equipment,
            Dots
        FROM RankedLifters
        WHERE rn = 1
        ORDER BY Dots DESC
        LIMIT ? OFFSET ?;
    `;

    return db.prepare(query).all(limit, offset) as TopLifter[];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Display top ranked lifters'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const topLifters: TopLifter[] = getTopLifters();

            if (topLifters.length === 0) {
                await interaction.editReply('No data found for top lifters.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#c62932')
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription('Top lifters sorted by Dots')
                .setFooter({
                    text: 'Data retrieved from OpenPowerlifting',
                });

            const fields = topLifters.flatMap((lifter, index) => [
                {
                    name: `\`${index + 1}.\` ${lifter.Name} (${lifter.Sex})`,
                    value: `Squat: ${lifter.Squat} | Bench : ${lifter.Bench} | Deadlift: ${lifter.Deadlift}`,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `Total: ${lifter.Total} | Dots: ${(lifter.Dots || 0).toFixed(2)}`,
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

                const newLifters = getTopLifters(currentPage);
                const newFields = newLifters.flatMap((lifter, index) => [
                    {
                        name: `\`${(currentPage - 1) * 5 + index + 1}.\` ${lifter.Name} (${lifter.Sex})`,
                        value: `Squat: ${lifter.Squat} | Bench : ${lifter.Bench} | Deadlift: ${lifter.Deadlift}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `Total: ${lifter.Total} | Dots: ${(lifter.Dots || 0).toFixed(2)}`,
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
