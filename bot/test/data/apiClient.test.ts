import { beforeEach, describe, expect, it, vi } from 'vitest';
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

vi.mock('../../src/utils/config', () => ({
    config: {
        API_BASE_URL: 'http://localhost:8080',
        ENABLE_MOCK_API: false,
    },
}));

const mockGet = vi.hoisted(() => vi.fn());

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: mockGet,
            defaults: { baseURL: 'http://localhost:8080' },
        })),
    },
}));

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
    beforeEach(() => {
        mockGet.mockReset();
        vi.mocked(logger.error).mockClear();
    });

    it('getLifter returns lifter data from the API', async () => {
        mockGet.mockResolvedValueOnce({ data: mockLifter });
        const result = await getLifter('Jane Doe');

        expect(result).toEqual(mockLifter);
        expect(logger.error).not.toHaveBeenCalled();
    });

    it('getMeet returns meet data from the API', async () => {
        mockGet.mockResolvedValueOnce({ data: mockMeet });
        const result = await getMeet('Mock Meet');

        expect(result).toEqual(mockMeet);
        expect(logger.error).not.toHaveBeenCalled();
    });

    it('getTopLifters returns top lifter data from the API', async () => {
        mockGet.mockResolvedValueOnce({ data: mockTopLifters });
        const result = await getTopLifters(1);

        expect(result).toEqual(mockTopLifters);
        expect(logger.error).not.toHaveBeenCalled();
    });

    it('getLifter returns undefined and logs error on network failure', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getLifter('Jane Doe');

        expect(result).toBeUndefined();
        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching lifter:',
            expect.any(Error),
        );
    });

    it('getMeet returns undefined and logs error on network failure', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getMeet('Mock Meet');

        expect(result).toBeUndefined();
        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching meet:',
            expect.any(Error),
        );
    });

    it('getTopLifters returns undefined and logs error on network failure', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await getTopLifters(1);

        expect(result).toBeUndefined();
        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching top lifters:',
            expect.any(Error),
        );
    });
});
