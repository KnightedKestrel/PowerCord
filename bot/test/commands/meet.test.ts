import { ChatInputCommandInteraction } from 'discord.js';
import { describe, expect, it, vi } from 'vitest';
import * as meetCommand from '../../src/commands/opl/meet';

vi.mock('../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('discord.js', () => ({
    SlashCommandBuilder: class {
        setName() {
            return this;
        }
        setDescription() {
            return this;
        }
        addStringOption() {
            return this;
        }
    },
    EmbedBuilder: class {
        setColor() {
            return this;
        }
        setTitle() {
            return this;
        }
        setDescription() {
            return this;
        }
        setFooter() {
            return this;
        }
        setFields() {
            return this;
        }
    },
    ActionRowBuilder: class {
        addComponents() {
            return this;
        }
    },
    ButtonBuilder: class {
        setCustomId() {
            return this;
        }
        setLabel() {
            return this;
        }
        setStyle() {
            return this;
        }
        setDisabled() {
            return this;
        }
    },
    ButtonStyle: {
        Primary: 1,
    },
}));

vi.mock('../src/data/api', () => ({
    api: {
        getMeet: vi.fn((name: string) => {
            const mockData = [
                {
                    name: 'Labors of Strength',
                    federation: 'IPF',
                    date: '2025-06-15',
                    country: 'Greece',
                    state: '',
                    entries: [
                        {
                            place: 1,
                            name: 'Hercules',
                            sex: 'M',
                            age: 39,
                            equipment: 'Raw',
                            weightClass: 100,
                            bodyweight: 98.6,
                            squat: 1018,
                            bench: 758,
                            deadlift: 729,
                            total: 2505,
                            dots: 1551.41,
                        },
                    ],
                },
                { name: 'Thunder Hammer Meet', entries: [] },
            ];

            const match = mockData.find((meet) =>
                meet.name.toLowerCase().includes(name.toLowerCase()),
            );

            return Promise.resolve(match);
        }),
    },
}));

const mockInteraction = (name: string) => {
    const interaction = {
        options: {
            getString: vi.fn().mockReturnValue(name),
        },
        deferReply: vi.fn().mockResolvedValue(undefined),
        editReply: vi.fn().mockResolvedValue(undefined),
        reply: vi.fn().mockResolvedValue(undefined),
        fetchReply: vi.fn().mockResolvedValue({
            createMessageComponentCollector: vi.fn().mockReturnValue({
                on: vi.fn(),
            }),
        }),
        user: { id: '12345' },
        channel: { id: 'test-channel' },
        guild: { id: 'test-guild' },
        client: {},
    };

    return interaction as unknown as ChatInputCommandInteraction;
};

describe('Meet command', () => {
    const execute = meetCommand['execute'];

    it('generates an embed with meet data', async () => {
        const interaction = mockInteraction('Labors of Strength');

        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            expect.objectContaining({
                embeds: [
                    expect.objectContaining({
                        title: '🥇 Powerlifting Rankings',
                        description: expect.stringContaining(
                            'Top lifters for **Labors of Strength**',
                        ),
                        fields: expect.any(Array),
                    }),
                ],
            }),
        );
    });

    it('handles no data found for meet', async () => {
        const interaction = mockInteraction('NonExistentMeet');

        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            'No data found for meet: NonExistentMeet.',
        );
    });
});
