import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    createChatInputInteraction,
    createPaginationInteraction,
} from '../helpers/interactions';

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

const makeLifter = (name: string, dots: number) => ({
    name,
    sex: 'M' as const,
    squat: 300,
    bench: 200,
    deadlift: 400,
    total: 900,
    dots,
});

const mockTopLifters = [
    makeLifter('Zeus', 450.5),
    makeLifter('Hades', 435.2),
    makeLifter('Poseidon', 420.0),
];

const mockTopLiftersMultiPage = [
    makeLifter('Zeus', 600),
    makeLifter('Hades', 590),
    makeLifter('Poseidon', 580),
    makeLifter('Ares', 570),
    makeLifter('Apollo', 560),
    makeLifter('Hermes', 550),
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

    it('replies with not-found message when no data exists', async () => {
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

    it('advances to next page when next button is clicked', async () => {
        mockGetTopLifters.mockResolvedValue(mockTopLiftersMultiPage);
        const { interaction, handlers } = createPaginationInteraction();
        await execute(interaction as any);

        const buttonInteraction = {
            customId: 'next',
            user: { id: '12345' },
            update: vi.fn().mockResolvedValue(undefined),
        };
        await handlers['collect'](buttonInteraction);

        expect(buttonInteraction.update).toHaveBeenCalledWith(
            expect.objectContaining({ embeds: expect.any(Array) }),
        );
        const { embeds } = vi.mocked(buttonInteraction.update).mock
            .calls[0][0] as any;
        expect(embeds[0].description).toContain('Page 2');
    });

    it('does not decrement page when prev is clicked on the first page', async () => {
        mockGetTopLifters.mockResolvedValue(mockTopLiftersMultiPage);
        const { interaction, handlers } = createPaginationInteraction();
        await execute(interaction as any);

        const buttonInteraction = {
            customId: 'prev',
            user: { id: '12345' },
            update: vi.fn().mockResolvedValue(undefined),
        };
        await handlers['collect'](buttonInteraction);

        expect(buttonInteraction.update).not.toHaveBeenCalled();
    });

    it('disables all buttons when the collector ends', async () => {
        mockGetTopLifters.mockResolvedValue(mockTopLiftersMultiPage);
        const { interaction, handlers } = createPaginationInteraction();
        await execute(interaction as any);

        handlers['end']();

        const lastCall = vi
            .mocked(interaction.editReply)
            .mock.calls.at(-1)![0] as any;
        expect(lastCall.components[0].components[0].disabled).toBe(true);
        expect(lastCall.components[0].components[1].disabled).toBe(true);
    });
});
