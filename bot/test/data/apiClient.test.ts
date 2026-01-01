import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLifter, getMeet, getTopLifters } from '../../src/data/apiClient';
import { Lifter, Meet, TopLifter } from '../../src/types/types';
import logger from '../../src/utils/logger';

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
}));

vi.mock('axios');

const mockAxios = vi.mocked(axios, true);

const mockLifter: Lifter = {
    name: 'Jane Doe',
    meets: [
        {
            place: 1,
            federation: 'USAPL',
            date: '2025-07-30',
            country: 'USA',
            name: 'Mock Meet',
            equipment: 'Raw',
        },
    ],
    personalBests: [
        {
            equipment: 'Raw',
            squat: '150',
            bench: '100',
            deadlift: '180',
            total: '430',
            dots: '500',
        },
    ],
};

const mockMeet: Meet = {
    name: 'Mock Meet',
    federation: 'USAPL',
    date: '2025-07-30',
    country: 'USA',
    entries: [
        {
            place: 1,
            name: 'Jane Doe',
            sex: 'F',
            equipment: 'Raw',
        },
    ],
};

const mockTopLifters: TopLifter[] = [
    {
        name: 'Jane Doe',
        sex: 'F',
        squat: 150,
        bench: 100,
        deadlift: 180,
        total: 430,
        dots: 500,
    },
    {
        name: 'John Smith',
        sex: 'M',
        squat: 200,
        bench: 120,
        deadlift: 220,
        total: 540,
        dots: 480,
    },
];

describe('apiClient', () => {
    let mockGet: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockGet = vi.fn();
        mockAxios.create.mockReturnValue({
            get: mockGet,
        } as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // it('getLifter returns lifter from API', async () => {
    //     mockGet.mockResolvedValueOnce({ data: mockLifter });
    //     const result = await getLifter('Jane Doe');

    //     expect(logger.error).not.toHaveBeenCalled();
    //     expect(result).toEqual(mockLifter);
    // });

    // it('getMeet returns meet from API', async () => {
    //     mockGet.mockResolvedValueOnce({ data: mockMeet });
    //     const result = await getMeet('Mock Meet');

    //     expect(logger.error).not.toHaveBeenCalled();
    //     expect(result).toEqual(mockMeet);
    // });

    // it('getTopLifters returns top lifters from API', async () => {
    //     mockGet.mockResolvedValueOnce({ data: mockTopLifters });
    //     const result = await getTopLifters(1);

    //     expect(logger.error).not.toHaveBeenCalled();
    //     expect(result).toEqual(mockTopLifters);
    // });

    it('getLifter returns undefined on error', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getLifter('Jane Doe');

        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching lifter:',
            expect.any(Error),
        );
        expect(result).toBeUndefined();
    });

    it('getMeet returns undefined on error', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getMeet('Mock Meet');

        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching meet:',
            expect.any(Error),
        );
        expect(result).toBeUndefined();
    });

    it('getTopLifters returns undefined on error', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getTopLifters(1);

        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching top lifters:',
            expect.any(Error),
        );
        expect(result).toBeUndefined();
    });
});
