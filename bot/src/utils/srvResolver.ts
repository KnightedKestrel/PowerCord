import dns from 'dns/promises';
import logger from '../utils/logger';

export interface SrvRecord {
    name: string;
    port: number;
    priority: number;
    weight: number;
}

export async function resolveSrv(
    domain: string,
): Promise<{ host: string; port: number }> {
    try {
        const records: SrvRecord[] = await dns.resolveSrv(domain);

        if (records.length === 0) {
            throw new Error(`No SRV records found for ${domain}`);
        }

        records.sort((a, b) => a.priority - b.priority || b.weight - a.weight);

        const { name: host, port } = records[0];
        logger.info(`Resolved SRV for ${domain}: ${host}:${port}`);

        return { host, port };
    } catch (error) {
        logger.error(`Error resolving SRV for ${domain}:`, error);
        throw error;
    }
}
