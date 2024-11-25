import { ChatInputCommandInteraction } from 'discord.js';
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
import DatabaseManager from '../../data/database';

interface TopLifter {
    Name: string;
    Sex: string;
    Squat: number;
    Bench: number;
    Deadlift: number;
    Total: number;
    Dots: number;
}

export function getTopLifters(): TopLifter[] {
    const db = DatabaseManager.getInstance().getDB();

    const query = `
        SELECT
            Name,
            Sex,
            Best3SquatKg AS Squat,
            Best3BenchKg AS Bench,
            Best3DeadliftKg AS Deadlift,
            TotalKg AS Total,
            Equipment,
            Dots
        FROM entries
        WHERE
            Dots IS NOT NULL
            AND Dots != ''
            AND Equipment IN ('Raw', 'Wraps')
        ORDER BY Dots DESC
        LIMIT 5;
    `;

    return db.prepare(query).all() as TopLifter[];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Display top ranked lifters'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const topLifters: TopLifter[] = getTopLifters();

            if (topLifters.length === 0) {
                await interaction.reply('No data found for top lifters.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#c62932')
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription('Top lifters sorted by Dots')
                .setFooter({
                    text: 'Data retrieved from OpenPowerlifting',
                });

            const fields = topLifters.map((lifter, index) => ({
                name: `\`${index + 1}.\` ${lifter.Name} (${lifter.Sex})`,
                value: `\`\`\`S / B / D | Total | Dots\n${lifter.Squat || 0} / ${lifter.Bench || 0} / ${lifter.Deadlift || 0} | ${lifter.Total || 0} | ${(lifter.Dots || 0).toFixed(2)}\`\`\``,
                inline: false,
            }));

            embed.addFields(fields);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing /top command:', error);
            await interaction.reply({
                content: 'An error occurred while fetching the top lifters.',
                ephemeral: true,
            });
        }
    },
};
