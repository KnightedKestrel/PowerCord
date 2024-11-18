import { ChatInputCommandInteraction } from 'discord.js';
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

interface TopLifter {
    LifterID: number;
    Name: string;
    Sex: string;
    Squat: number,
    Bench: number,
    Deadlift: number,
    Total: number,
    Dots: number;
}

//   export function getTopLifters(): TopLifter[] {
//     const query = `
//       SELECT lifters.LifterID, lifters.Name, lifters.Sex, entries.Dots
//       FROM lifters
//       JOIN entries ON lifters.LifterID = entries.LifterID
//       ORDER BY entries.Dots DESC
//       LIMIT 10;
//     `;
//   }

const topLifters: TopLifter[] = [
    {
        LifterID: 1,
        Name: 'Kristy Hawkins',
        Sex: 'F',
        Squat: 310,
        Bench: 152.5,
        Deadlift: 262.5,
        Total: 725,
        Dots: 711.19,
    },
    {
        LifterID: 2,
        Name: 'Marianna Gasparyan',
        Sex: 'F',
        Squat: 260,
        Bench: 132.5,
        Deadlift: 220,
        Total: 612.5,
        Dots: 709.96,
    },
    {
        LifterID: 3,
        Name: 'Hunter Henderson',
        Sex: 'F',
        Squat: 295,
        Bench: 147.5,
        Deadlift: 260,
        Total: 702.5,
        Dots: 687.63,
    },
];

const embed = new EmbedBuilder()
    .setColor('#c62932')
    .setTitle('🥇 Powerlifting Rankings')
    .setDescription('Top lifters sorted by Dots')
    .setFooter({
        text: 'Data retrieved from OpenPowerlifting',
    });

const fields = topLifters.map((lifter, index) => ({
    name: `\`${index + 1}.\` ${lifter.Name}`,
    value: `\`\`\`S / B / D | Total | Dots\n${lifter.Squat} / ${lifter.Bench} / ${lifter.Deadlift} | ${lifter.Total} | ${lifter.Dots}\`\`\``,
    inline: false,
}));

embed.addFields(fields);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Display top ranked lifters'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ embeds: [embed] });
    },
};
