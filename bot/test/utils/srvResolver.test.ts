import dns from 'dns/promises';
import { describe, expect, it, vi } from 'vitest';
import logger from '../../src/utils/logger';
import { resolveSrv, SrvRecord } from '../../src/utils/srvResolver';

vi.mock('dns/promises');

const infoSpy = vi
    .spyOn(logger, 'info')
    .mockImplementation((..._args: any[]) => logger);
const errorSpy = vi
    .spyOn(logger, 'error')
    .mockImplementation((..._args: any[]) => logger);

describe('srvResolver', () => {
    it('should resolve and return the top SRV record', async () => {
        const mockRecords: SrvRecord[] = [
            { name: 'host1.example.com', port: 8080, priority: 10, weight: 1 },
            { name: 'host2.example.com', port: 8081, priority: 5, weight: 2 },
        ];
        (dns.resolveSrv as any).mockResolvedValue(mockRecords);

        const result = await resolveSrv('powercord-api.powercord.internal');

        expect(result).toEqual({ host: 'host2.example.com', port: 8081 });
        expect(infoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Resolved SRV'),
        );
        expect(dns.resolveSrv).toHaveBeenCalledWith(
            'powercord-api.powercord.internal',
        );
    });

    it('should throw if no SRV records found', async () => {
        (dns.resolveSrv as any).mockResolvedValue([]);

        await expect(resolveSrv('invalid.domain')).rejects.toThrow(
            'No SRV records found for invalid.domain',
        );
        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error resolving SRV'),
            expect.any(Error),
        );
    });

    it('should throw on DNS resolution error', async () => {
        (dns.resolveSrv as any).mockRejectedValue(new Error('DNS error'));

        await expect(
            resolveSrv('powercord-api.powercord.internal'),
        ).rejects.toThrow('DNS error');
        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error resolving SRV'),
            expect.any(Error),
        );
    });
});
