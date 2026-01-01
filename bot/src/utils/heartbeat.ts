import axios from 'axios';
import { config } from './config';
import logger from './logger';

const HEARTBEAT_INTERVAL = 60000; // 60 seconds

export function startHeartbeat() {
    if (!config.BETTERSTACK_HEARTBEAT_URL) {
        logger.warn('BetterStack heartbeat URL not configured, skipping heartbeat');
        return;
    }

    logger.info('Starting BetterStack heartbeat monitor');
    sendHeartbeat();

    setInterval(() => {
        sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
}

async function sendHeartbeat() {
    try {
        await axios.get(config.BETTERSTACK_HEARTBEAT_URL!, { timeout: 5000 });
    } catch (error) {
        logger.error('Failed to send heartbeat to BetterStack:', error);
    }
}
