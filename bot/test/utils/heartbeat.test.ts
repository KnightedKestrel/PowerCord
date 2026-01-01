import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { config } from '../../src/utils/config';
import logger from '../../src/utils/logger';
import { startHeartbeat } from '../../src/utils/heartbeat';

vi.mock('axios');
vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('../../src/utils/config', () => ({
    config: {
        BETTERSTACK_HEARTBEAT_URL: undefined,
    },
}));

const mockAxios = vi.mocked(axios, true);

describe('heartbeat', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should skip heartbeat when URL is not configured', () => {
        (config as any).BETTERSTACK_HEARTBEAT_URL = undefined;

        startHeartbeat();

        expect(logger.warn).toHaveBeenCalledWith(
            'BetterStack heartbeat URL not configured, skipping heartbeat',
        );
        expect(mockAxios.get).not.toHaveBeenCalled();
    });

    it('should start heartbeat when URL is configured', () => {
        (config as any).BETTERSTACK_HEARTBEAT_URL = 'https://heartbeat.betterstack.com/test';
        mockAxios.get.mockResolvedValue({ data: 'ok' });

        startHeartbeat();

        expect(logger.info).toHaveBeenCalledWith('Starting BetterStack heartbeat monitor');
        expect(mockAxios.get).toHaveBeenCalledWith(
            'https://heartbeat.betterstack.com/test',
            { timeout: 5000 },
        );
    });

    it('should send heartbeat at regular intervals', async () => {
        (config as any).BETTERSTACK_HEARTBEAT_URL = 'https://heartbeat.betterstack.com/test';
        mockAxios.get.mockResolvedValue({ data: 'ok' });

        startHeartbeat();

        expect(mockAxios.get).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(60000);
        expect(mockAxios.get).toHaveBeenCalledTimes(2);

        vi.advanceTimersByTime(60000);
        expect(mockAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should log error when heartbeat fails', async () => {
        (config as any).BETTERSTACK_HEARTBEAT_URL = 'https://heartbeat.betterstack.com/test';
        const error = new Error('Network error');
        mockAxios.get.mockRejectedValue(error);

        startHeartbeat();

        await vi.waitFor(() => {
            expect(logger.error).toHaveBeenCalledWith(
                'Failed to send heartbeat to BetterStack:',
                error,
            );
        });
    });
});
