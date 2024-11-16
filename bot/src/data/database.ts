import Database from 'better-sqlite3';
import { schema } from './schema';

class SQLiteDatabaseManager {
    private db: Database.Database;

    constructor() {
        const dbName = process.env.DB_NAME || 'opl.sqlite';
        this.db = new Database(dbName);
        console.log(`Connected to SQLite database at ${dbName}`);
    }

    async createDB(): Promise<void> {
        try {
            const sqlArray = schema.split(';').map((stmt) => stmt.trim()).filter(Boolean);

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

    close(): void {
        if (this.db) {
            this.db.close();
            console.log('SQLite database connection closed.');
        }
    }
}

export default SQLiteDatabaseManager;
