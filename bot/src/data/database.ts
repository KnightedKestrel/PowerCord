import * as fs from 'fs';
import * as path from 'path';
import * as Database from 'better-sqlite3';
import logger from '../logger';
import { schema } from './schema';

require('dotenv').config();

class DatabaseManager {
    private static instance: DatabaseManager | null = null;
    private db: Database.Database;

    constructor() {
        const dbDirectory = path.resolve(__dirname, 'sqlite');
        const dbPath = path.resolve(
            __dirname,
            'sqlite',
            process.env.DB_NAME || 'opl.sqlite',
        );

        // Ensure the downloads directory exists
        fs.mkdirSync(dbDirectory, { recursive: true });

        this.db = new Database.default(dbPath, {
            /*verbose: console.log*/
        });
        logger.info(`Connected to database at ${dbPath}`);
    }

    static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    async createDB(): Promise<void> {
        try {
            const sqlArray = schema
                .split(';')
                .map((stmt) => stmt.trim())
                .filter(Boolean);

            const transaction = this.db.transaction(() => {
                for (const query of sqlArray) {
                    this.db.exec(query);
                }
            });

            transaction();
            logger.info('Database schema created successfully.');
        } catch (err) {
            logger.error('Error creating database schema:', err);
            throw err;
        }
    }

    getDB(): Database.Database {
        return this.db;
    }

    close(): void {
        if (this.db) {
            this.db.close();
            logger.info('Database connection closed.');
        }
    }
}

export default DatabaseManager;
