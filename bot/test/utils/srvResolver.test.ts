import dns from 'dns/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import logger from '../../src/utils/logger';
import { resolveSrv, SrvRecord } from '../../src/utils/srvResolver';

vi.mock('dns/promises');

vi.mock('../../src/utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

describe('srvResolver', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('resolves and returns the highest-priority SRV record', async () => {
        const mockRecords: SrvRecord[] = [
            { name: 'host1.example.com', port: 8080, priority: 10, weight: 1 },
            { name: 'host2.example.com', port: 8081, priority: 5, weight: 2 },
        ];
        vi.mocked(dns.resolveSrv).mockResolvedValue(mockRecords);

        const result = await resolveSrv('powercord-api.powercord.internal');

        expect(result).toEqual({ host: 'host2.example.com', port: 8081 });
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining('Resolved SRV'),
        );
        expect(dns.resolveSrv).toHaveBeenCalledWith(
            'powercord-api.powercord.internal',
        );
    });

    it('throws when no SRV records are found', async () => {
        vi.mocked(dns.resolveSrv).mockResolvedValue([]);

        await expect(resolveSrv('invalid.domain')).rejects.toThrow(
            'No SRV records found for invalid.domain',
        );
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Error resolving SRV'),
            expect.any(Error),
        );
    });

    it('throws on DNS resolution error', async () => {
        vi.mocked(dns.resolveSrv).mockRejectedValue(new Error('DNS error'));

        await expect(
            resolveSrv('powercord-api.powercord.internal'),
        ).rejects.toThrow('DNS error');
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Error resolving SRV'),
            expect.any(Error),
        );
    });
});
