import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockConfig, mockApiClient, mockMockClient } = vi.hoisted(() => ({
    mockConfig: {
        API_BASE_URL: undefined as string | undefined,
        ENABLE_MOCK_API: false,
    },
    mockApiClient: {
        getLifter: vi.fn(),
        getMeet: vi.fn(),
        getTopLifters: vi.fn(),
    },
    mockMockClient: {
        getLifter: vi.fn(),
        getMeet: vi.fn(),
        getTopLifters: vi.fn(),
    },
}));

vi.mock('../../src/utils/config', () => ({ config: mockConfig }));
vi.mock('../../src/data/apiClient', () => mockApiClient);
vi.mock('../../src/data/mockClient', () => mockMockClient);

describe('api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('routes getLifter to mockClient when ENABLE_MOCK_API is true', async () => {
        mockConfig.ENABLE_MOCK_API = true;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getLifter('test');

        expect(mockMockClient.getLifter).toHaveBeenCalledWith('test');
        expect(mockApiClient.getLifter).not.toHaveBeenCalled();
    });

    it('routes getLifter to apiClient when ENABLE_MOCK_API is false', async () => {
        mockConfig.ENABLE_MOCK_API = false;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getLifter('test');

        expect(mockApiClient.getLifter).toHaveBeenCalledWith('test');
        expect(mockMockClient.getLifter).not.toHaveBeenCalled();
    });

    it('routes getMeet to mockClient when ENABLE_MOCK_API is true', async () => {
        mockConfig.ENABLE_MOCK_API = true;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getMeet('test meet');

        expect(mockMockClient.getMeet).toHaveBeenCalledWith('test meet');
        expect(mockApiClient.getMeet).not.toHaveBeenCalled();
    });

    it('routes getMeet to apiClient when ENABLE_MOCK_API is false', async () => {
        mockConfig.ENABLE_MOCK_API = false;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getMeet('test meet');

        expect(mockApiClient.getMeet).toHaveBeenCalledWith('test meet');
        expect(mockMockClient.getMeet).not.toHaveBeenCalled();
    });

    it('routes getTopLifters to mockClient when ENABLE_MOCK_API is true', async () => {
        mockConfig.ENABLE_MOCK_API = true;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getTopLifters(2);

        expect(mockMockClient.getTopLifters).toHaveBeenCalledWith(2);
        expect(mockApiClient.getTopLifters).not.toHaveBeenCalled();
    });

    it('routes getTopLifters to apiClient when ENABLE_MOCK_API is false', async () => {
        mockConfig.ENABLE_MOCK_API = false;
        mockConfig.API_BASE_URL = 'http://localhost:3000/api';

        const { api } = await import('../../src/data/api');
        await api.getTopLifters(2);

        expect(mockApiClient.getTopLifters).toHaveBeenCalledWith(2);
        expect(mockMockClient.getTopLifters).not.toHaveBeenCalled();
    });
});
