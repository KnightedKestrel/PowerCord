import logger from '../utils/logger';
import DatabaseManager from './database';

const db = DatabaseManager.getInstance().getDB();

export function getLatestUpdatedDate(): Promise<string | null> {
    try {
        const date = db
            .prepare('SELECT UpdatedDate FROM opl_data_version LIMIT 1')
            .pluck()
            .get() as string | undefined;
        return Promise.resolve(date ?? null);
    } catch (error) {
        logger.error('Failed to fetch UpdatedDate:', error);
        return Promise.resolve(null);
    }
}
