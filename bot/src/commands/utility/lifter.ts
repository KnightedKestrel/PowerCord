import { SlashCommandStringOption } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import DatabaseManager from '../../data/database';
import logger from '../../logger';

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

interface Lifter {
    Place: number;
    Federation: string;
    Date: string;
    MeetCountry: string;
    MeetState: string;
    MeetName: string;
    Division: string;
    Age: number;
    Equipment: string;
    Class: number;
    Weight: number;
    Squat: number;
    Bench: number;
    Deadlift: number;
    Total: number;
    Dots: number;
}

export function getLifters(name: string): Lifter[] {
    const db = DatabaseManager.getInstance().getDB();

    const query = `
        SELECT
            Place,
            Federation,
            Date,
            MeetCountry,
            MeetName,
            MeetState,
            Division,
            Age,
            Equipment,
            WeightClassKg AS Class,
            BodyweightKg AS Weight,
            Best3SquatKg AS Squat,
            Best3BenchKg AS Bench,
            Best3DeadliftKg AS Deadlift,
            TotalKg AS Total,
            Dots
        FROM entries
        WHERE
            Dots IS NOT NULL
            AND Dots != ''
            AND Equipment IN ('Raw', 'Wraps')
            AND Name LIKE ?
        ORDER BY Dots DESC
        LIMIT 5;
    `;

    return db.prepare(query).all(`%${name}%`) as Lifter[];
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

            const lifters: Lifter[] = getLifters(name);

            for (const lifter of lifters) {
                if (!lifter.Squat) lifter.Squat = '—' as unknown as number;
                if (!lifter.Bench) lifter.Bench = '—' as unknown as number;
                if (!lifter.Deadlift)
                    lifter.Deadlift = '—' as unknown as number;
                if (!lifter.Age) lifter.Age = '—' as unknown as number;
                if (!lifter.MeetState)
                    lifter.MeetState = '—' as unknown as string;
            }

            if (lifters.length === 0) {
                await interaction.editReply(
                    `No data found for lifter: ${name}.`,
                );
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#c62932')
                .setTitle('🥇 Powerlifting Rankings')
                .setDescription(`Last 5 meets for **${name}**, sorted by Dots`)
                .setFooter({
                    text: 'Data retrieved from OpenPowerlifting',
                });

            const fields = lifters.flatMap((lifter, index) => [
                {
                    name: `\`${index + 1}.\` ${lifter.Federation} ${lifter.MeetName}`,
                    value: `
                    ${lifter.Place}st Place, ${lifter.MeetState}
                    Date: ${lifter.Date}
                    Age: ${lifter.Age}
                    Equip: ${lifter.Equipment}
                    Class: ${lifter.Class}
                    Weight: ${lifter.Weight}`,
                    inline: true,
                },
                {
                    name: `\u200B`,
                    value: `\`\`\`Squat: ${lifter.Squat}\nBench: ${lifter.Bench}\nDead: ${lifter.Deadlift}\n\nTotal: ${lifter.Total}\nDOTS: ${lifter.Dots}\`\`\``,
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
