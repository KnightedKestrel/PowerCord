import Database from 'better-sqlite3';
import { schema } from './schema';

class DatabaseManager {
    private static instance: DatabaseManager | null = null;
    private db: Database.Database;

    constructor() {
        const dbName = process.env.DB_NAME || 'opl.sqlite';
        this.db = new Database(dbName, { verbose: console.log });
        console.log(`Connected to database at ${dbName}`);
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
            console.log('Database schema created successfully.');
        } catch (err) {
            console.error('Error creating database schema:', err);
            throw err;
        }
    }

    getDB(): Database.Database {
        return this.db;
    }

    close(): void {
        if (this.db) {
            this.db.close();
            console.log('Database connection closed.');
        }
    }
}

export default DatabaseManager;
