import Database, { Database as DatabaseType } from 'better-sqlite3';
import {
    afterAll,
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import DatabaseManager from '../data/database';
import { getLatestUpdatedDate } from '../data/queries';
import logger from '../logger';

// Mock the DatabaseManager with a sqlite database in memory
vi.mock('../data/database', () => {
    const dbInstance = new Database(':memory:');
    return {
        default: {
            getInstance: vi.fn().mockReturnValue({
                getDB: vi.fn().mockReturnValue(dbInstance),
                createDB: vi.fn().mockImplementation(async () => {
                    dbInstance.exec(`
                        CREATE TABLE IF NOT EXISTS opl_data_version (
                            UpdatedDate TEXT PRIMARY KEY UNIQUE
                        )
                    `);
                }),
            }),
        },
    };
});

vi.mock('../logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

describe('getLatestUpdatedDate', () => {
    let db: DatabaseType;

    beforeEach(async () => {
        db = DatabaseManager.getInstance().getDB();
        await DatabaseManager.getInstance().createDB();
    });

    afterEach(() => {
        db.exec('DROP TABLE IF EXISTS opl_data_version');
        vi.restoreAllMocks();
    });

    afterAll(() => {
        db.close();
    });

    it('returns the latest UpdatedDate when a row exists', async () => {
        db.prepare('INSERT INTO opl_data_version (UpdatedDate) VALUES (?)').run(
            '2001-01-01',
        );
        const result = await getLatestUpdatedDate();

        expect(logger.error).not.toHaveBeenCalled();
        expect(result).toBe('2001-01-01');
    });
});
