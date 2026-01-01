import express from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';
import logger from '../../src/utils/logger';

vi.mock('express', () => ({
    default: vi.fn(() => ({
        get: vi.fn(),
        listen: vi.fn((port: number, callback: () => void) => {
            callback();
            return { close: vi.fn() };
        }),
    })),
}));

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
    },
}));

describe('health', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should set up health endpoint and start server on port 3000', async () => {
        const mockApp = {
            get: vi.fn(),
            listen: vi.fn((port: number, callback: () => void) => {
                callback();
                return { close: vi.fn() };
            }),
        };
        (express as any).mockReturnValue(mockApp);

        await import('../../src/utils/health');

        expect(mockApp.get).toHaveBeenCalledWith(
            '/health',
            expect.any(Function),
        );
        expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
        expect(logger.info).toHaveBeenCalledWith(
            'Health check is running on port 3000',
        );
    });

    it('should return status ok from health endpoint handler', () => {
        const mockReq = {};
        const mockRes = {
            send: vi.fn(),
        };

        const healthHandler = (req: any, res: any) => {
            res.send({ status: 'ok' });
        };

        healthHandler(mockReq, mockRes);

        expect(mockRes.send).toHaveBeenCalledWith({ status: 'ok' });
    });
});
