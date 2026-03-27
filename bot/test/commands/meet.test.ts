import { describe, expect, it, vi } from 'vitest';
import * as meetCommand from '../../src/commands/opl/meet';
import { createChatInputInteraction } from '../helpers/interactions';

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('discord.js');

vi.mock('../../src/data/api', () => ({
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
                            bodyWeight: 98.6,
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

describe('Meet command', () => {
    const execute = meetCommand['execute'];

    it('generates an embed with meet data', async () => {
        const interaction = createChatInputInteraction({
            name: 'Labors of Strength',
        });
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
        const interaction = createChatInputInteraction({
            name: 'NonExistentMeet',
        });

        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            'No data found for meet: NonExistentMeet.',
        );
    });
});
