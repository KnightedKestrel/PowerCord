import { SlashCommandStringOption } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
} from 'discord.js';
import DatabaseManager from '../data/database';
import logger from '../utils/logger';

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

interface Meet {
    Place: number;
    Federation: string;
    Date: string;
    MeetCountry: string;
    MeetState: string;
    MeetName: string;
    Division: string;
    Name: string;
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

export function getMeets(meetName: string, offset: number = 0): Meet[] {
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
            Name,
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
            AND MeetName LIKE ?
        ORDER BY Dots DESC
        LIMIT 5 OFFSET ?;
    `;

    return db.prepare(query).all(`%${meetName}%`, offset) as Meet[];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meet')
        .setDescription(`Displays meet's top lifters with pagination`)
        .addStringOption((option: SlashCommandStringOption) =>
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

            let offset = 0;
            const meets: Meet[] = getMeets(name, offset);

            if (meets.length === 0) {
                await interaction.editReply(`No data found for meet: ${name}.`);
                return;
            }

            const createEmbed = (
                entries: Meet[],
                currentPage: number,
            ): InstanceType<typeof EmbedBuilder> => {
                const embed = new EmbedBuilder()
                    .setColor('#c62932')
                    .setTitle('🥇 Powerlifting Rankings')
                    .setDescription(
                        `Top lifters for **${name}**, page ${currentPage}`,
                    )
                    .setFooter({
                        text: 'Data retrieved from OpenPowerlifting',
                    });

                const fields = entries.flatMap((meet, index) => [
                    {
                        name: `\`${index + 1 + offset}.\` ${meet.Name}`,
                        value: `Squat: ${meet.Squat} | Bench: ${meet.Bench} | Deadlift: ${meet.Deadlift}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `Total: ${meet.Total} | Dots: ${meet.Dots}`,
                        inline: true,
                    },
                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true,
                    },
                ]);

                embed.addFields(fields);
                return embed;
            };

            const createActionRow = (
                hasPrevious: boolean,
                hasNext: boolean,
            ): ActionRowBuilder<ButtonBuilder> => {
                const row = new ActionRowBuilder<ButtonBuilder>();
                if (hasPrevious) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('◀')
                            .setStyle(ButtonStyle.Primary),
                    );
                }
                if (hasNext) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Primary),
                    );
                }
                return row;
            };

            const embed = createEmbed(meets, 1);
            const hasNext = getMeets(name, offset + 5).length > 0;
            const actionRow = createActionRow(false, hasNext);

            await interaction.editReply({
                embeds: [embed],
                components: [actionRow],
            });

            const reply = await interaction.fetchReply();

            const collector = reply.createMessageComponentCollector({
                time: 60000,
            });

            collector.on(
                'collect',
                async (buttonInteraction: ButtonInteraction) => {
                    if (buttonInteraction.user.id !== interaction.user.id) {
                        await buttonInteraction.reply({
                            content: "You can't interact with this button.",
                            ephemeral: true,
                        });
                        return;
                    }

                    if (buttonInteraction.customId === 'next') {
                        offset += 5;
                    } else if (buttonInteraction.customId === 'previous') {
                        offset -= 5;
                    }

                    const newMeets = getMeets(name, offset);
                    const newEmbed = createEmbed(newMeets, offset / 5 + 1);
                    const hasPrevious = offset > 0;
                    const hasNext = getMeets(name, offset + 5).length > 0;
                    const newActionRow = createActionRow(hasPrevious, hasNext);

                    await buttonInteraction.update({
                        embeds: [newEmbed],
                        components: [newActionRow],
                    });

                    if (!hasNext && !hasPrevious) {
                        collector.stop();
                    }
                },
            );

            collector.on('end', () => {
                reply.edit({ components: [] });
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
