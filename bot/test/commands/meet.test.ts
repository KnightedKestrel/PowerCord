import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as meetCommand from '../../src/commands/opl/meet';
import {
    createChatInputInteraction,
    createPaginationInteraction,
} from '../helpers/interactions';

const { mockGetMeet, mockGetMeetAutocomplete } = vi.hoisted(() => ({
    mockGetMeet: vi.fn(),
    mockGetMeetAutocomplete: vi.fn(),
}));

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('discord.js');

vi.mock('../../src/data/api', () => ({
    api: {
        getMeet: mockGetMeet,
        getMeetAutocomplete: mockGetMeetAutocomplete,
    },
}));

const makeEntry = (name: string, dots: number) => ({
    place: 1,
    name,
    sex: 'M',
    age: 30,
    equipment: 'Raw',
    weightClass: 100,
    bodyWeight: 98,
    squat: 300,
    bench: 200,
    deadlift: 400,
    total: 900,
    dots,
});

const mockSinglePageMeet = {
    name: 'Labors of Strength',
    federation: 'IPF',
    date: '2025-06-15',
    year: '2025',
    country: 'Greece',
    state: null,
    town: null,
    entries: [makeEntry('Hercules', 1551.41)],
};

const mockMultiPageMeet = {
    name: 'Multi Page Meet',
    federation: 'IPF',
    date: '2025-06-15',
    year: '2025',
    country: 'Greece',
    state: null,
    town: null,
    entries: [
        makeEntry('A', 600),
        makeEntry('B', 590),
        makeEntry('C', 580),
        makeEntry('D', 570),
        makeEntry('E', 560),
        makeEntry('F', 550),
    ],
};

describe('Meet command', () => {
    const execute = meetCommand['execute'];

    beforeEach(() => {
        mockGetMeet.mockReset();
        mockGetMeetAutocomplete.mockReset();
    });

    it('generates an embed with meet data', async () => {
        mockGetMeet.mockResolvedValue(mockSinglePageMeet);
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

    it('replies with not-found message when meet does not exist', async () => {
        mockGetMeet.mockResolvedValue(undefined);
        const interaction = createChatInputInteraction({
            name: 'NonExistentMeet',
        });
        await execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalled();
        expect(interaction.editReply).toHaveBeenCalledWith(
            'No data found for meet: NonExistentMeet.',
        );
    });

    it('sets up a message component collector after replying', async () => {
        mockGetMeet.mockResolvedValue(mockSinglePageMeet);
        const { interaction } = createPaginationInteraction({
            name: 'Labors of Strength',
        });
        await execute(interaction as any);

        expect(interaction.fetchReply).toHaveBeenCalled();
    });

    it('advances to next page when next button is clicked', async () => {
        mockGetMeet.mockResolvedValue(mockMultiPageMeet);
        const { interaction, handlers } = createPaginationInteraction({
            name: 'Multi Page Meet',
        });
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
        expect(embeds[0].description).toContain('page 2');
    });

    it('does not decrement page when prev is clicked on the first page', async () => {
        mockGetMeet.mockResolvedValue(mockMultiPageMeet);
        const { interaction, handlers } = createPaginationInteraction({
            name: 'Multi Page Meet',
        });
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
        mockGetMeet.mockResolvedValue(mockMultiPageMeet);
        const { interaction, handlers } = createPaginationInteraction({
            name: 'Multi Page Meet',
        });
        await execute(interaction as any);

        handlers['end']();

        const lastCall = vi
            .mocked(interaction.editReply)
            .mock.calls.at(-1)![0] as any;
        expect(lastCall.components[0].components[0].disabled).toBe(true);
        expect(lastCall.components[0].components[1].disabled).toBe(true);
    });
});
