import axios from 'axios';
import { Lifter, Meet, TopLifter } from '../types/types';
import { config } from '../utils/config';
import logger from '../utils/logger';
import { resolveSrv } from '../utils/srvResolver';

let api = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' },
});

(async () => {
    try {
        if (config.API_SRV_DOMAIN) {
            const { host, port } = await resolveSrv(config.API_SRV_DOMAIN);
            api.defaults.baseURL = `http://${host}:${port}`;
        }
    } catch (error) {
        logger.error('Failed to resolve SRV; using fallback baseURL');
    }
})();

export async function getLifter(name: string): Promise<Lifter | undefined> {
    logger.info(
        `Making request to: ${api?.defaults?.baseURL}/api/lifters?name=${name}`,
    );
    try {
        const response = await api.get('/api/lifters', { params: { name } });
        logger.info('Response data:', response.data);
        return response.data as Lifter;
    } catch (error) {
        logger.error('Error fetching lifter:', error);
        return undefined;
    }
}

export async function getMeet(name: string): Promise<Meet | undefined> {
    logger.info(
        `Making request to: ${api?.defaults?.baseURL}/api/meets?name=${name}`,
    );
    try {
        const response = await api.get('/api/meets', { params: { name } });
        logger.info('Response data:', response.data);
        return response.data as Meet;
    } catch (error) {
        logger.error('Error fetching meet:', error);
        return undefined;
    }
}

export async function getTopLifters(
    page: number = 1,
): Promise<TopLifter[] | undefined> {
    logger.info(
        `Making request to: ${api?.defaults?.baseURL}/api/top?page=${page}`,
    );
    try {
        const response = await api.get('/api/top', { params: { page } });
        logger.info('Response data:', response.data);
        return response.data as TopLifter[];
    } catch (error) {
        logger.error('Error fetching top lifters:', error);
        return undefined;
    }
}

export async function getLifterAutocomplete(
    query: string,
    limit: number = 10,
): Promise<string[] | undefined> {
    try {
        const response = await api.get('/api/lifters/autocomplete', {
            params: { query, limit },
        });
        return response.data as string[];
    } catch (error) {
        logger.error('Error fetching lifter autocomplete:', error);
        return undefined;
    }
}

export async function getMeetAutocomplete(
    query: string,
    limit: number = 10,
): Promise<string[] | undefined> {
    try {
        const response = await api.get('/api/meets/autocomplete', {
            params: { query, limit },
        });
        return response.data as string[];
    } catch (error) {
        logger.error('Error fetching meet autocomplete:', error);
        return undefined;
    }
}
