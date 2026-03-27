import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createChatInputInteraction } from '../helpers/interactions';

const mockGetTopLifters = vi.hoisted(() => vi.fn());

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('discord.js');

vi.mock('../../src/data/api', () => ({
    api: {
        getTopLifters: mockGetTopLifters,
    },
}));

const mockTopLifters = [
    {
        name: 'Zeus',
        sex: 'M',
        squat: 400,
        bench: 250,
        deadlift: 500,
        total: 1150,
        dots: 450.5,
    },
    {
        name: 'Hades',
        sex: 'M',
        squat: 380,
        bench: 240,
        deadlift: 490,
        total: 1110,
        dots: 435.2,
    },
    {
        name: 'Poseidon',
        sex: 'M',
        squat: 370,
        bench: 230,
        deadlift: 480,
        total: 1080,
        dots: 420.0,
    },
];

describe('Top command', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let execute: (interaction: any) => Promise<void>;

    beforeEach(async () => {
        vi.resetModules();
        vi.useFakeTimers();
        mockGetTopLifters.mockReset();
        const topModule = await import('../../src/commands/opl/top');
        execute = topModule['execute'];
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('handles no data found', async () => {
        mockGetTopLifters.mockResolvedValue(undefined);
        const interaction = createChatInputInteraction();
        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            'No data found for top lifters.',
        );
    });

    it('generates an embed with top lifters', async () => {
        mockGetTopLifters.mockResolvedValue(mockTopLifters);
        const interaction = createChatInputInteraction();
        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            expect.objectContaining({
                embeds: [
                    expect.objectContaining({
                        title: '🥇 Powerlifting Rankings',
                    }),
                ],
                components: expect.any(Array),
            }),
        );
    });

    it('sets up a message component collector after replying', async () => {
        mockGetTopLifters.mockResolvedValue(mockTopLifters);
        const interaction = createChatInputInteraction();
        await execute(interaction);

        expect(interaction.fetchReply).toHaveBeenCalled();
    });
});
