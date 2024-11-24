import fs from 'fs';
import path from 'path';
import { parse } from '@fast-csv/parse';
import DatabaseManager from './database';

export async function csvProcessor(csvPath: string, extractedDate: string): Promise<void> {
    const db = DatabaseManager.getInstance().getDB();

    console.log('Processing CSV file:', csvPath);

    try {
        // Ensure the headers match the expected schema
        const expectedHeaders = [
            'Name', 'Sex', 'Event', 'Equipment', 'Age', 'AgeClass', 'BirthYearClass', 'Division',
            'BodyweightKg', 'WeightClassKg', 'Squat1Kg', 'Squat2Kg', 'Squat3Kg', 'Squat4Kg',
            'Best3SquatKg', 'Bench1Kg', 'Bench2Kg', 'Bench3Kg', 'Bench4Kg', 'Best3BenchKg',
            'Deadlift1Kg', 'Deadlift2Kg', 'Deadlift3Kg', 'Deadlift4Kg', 'Best3DeadliftKg',
            'TotalKg', 'Place', 'Dots', 'Wilks', 'Glossbrenner', 'Goodlift', 'Tested',
            'Country', 'State', 'Federation', 'ParentFederation', 'Date', 'MeetCountry',
            'MeetState', 'MeetTown', 'MeetName', 'Sanctioned'
        ];

        // Read the first row of the CSV to validate headers
        const stream = fs.createReadStream(csvPath);
        const parser = parse({ headers: true });

        // Validate headers before trying to rewrite data
        let headersMatch = false;
        await new Promise<void>((resolve, reject) => {
            stream
                .pipe(parser)
                .on('headers', (headers) => {
                    headersMatch = JSON.stringify(headers) === JSON.stringify(expectedHeaders);
                    if (!headersMatch) {
                        reject(new Error(`CSV headers do not match the expected schema.`));
                    }
                    resolve();
                })
                .on('error', (error) => reject(error));
        });

        if (!headersMatch) {
            throw new Error('CSV headers do not match the expected schema.');
        }

        console.log('Headers validated successfully. Clearing the table.');

        // Clear the `entries` table before inserting new data
        db.prepare('DELETE FROM entries').run();

        console.log('Table cleared. Inserting new data.');

        const insertStmt = db.prepare(`
            INSERT INTO entries (
                Name, Sex, Event, Equipment, Age, AgeClass, BirthYearClass, Division, BodyweightKg, WeightClassKg,
                Squat1Kg, Squat2Kg, Squat3Kg, Squat4Kg, Best3SquatKg, Bench1Kg, Bench2Kg, Bench3Kg, Bench4Kg, Best3BenchKg,
                Deadlift1Kg, Deadlift2Kg, Deadlift3Kg, Deadlift4Kg, Best3DeadliftKg, TotalKg, Place, Dots, Wilks,
                Glossbrenner, Goodlift, Tested, Country, State, Federation, ParentFederation, Date, MeetCountry,
                MeetState, MeetTown, MeetName, Sanctioned
            ) VALUES (
                @Name, @Sex, @Event, @Equipment, @Age, @AgeClass, @BirthYearClass, @Division, @BodyweightKg, @WeightClassKg,
                @Squat1Kg, @Squat2Kg, @Squat3Kg, @Squat4Kg, @Best3SquatKg, @Bench1Kg, @Bench2Kg, @Bench3Kg, @Bench4Kg, @Best3BenchKg,
                @Deadlift1Kg, @Deadlift2Kg, @Deadlift3Kg, @Deadlift4Kg, @Best3DeadliftKg, @TotalKg, @Place, @Dots, @Wilks,
                @Glossbrenner, @Goodlift, @Tested, @Country, @State, @Federation, @ParentFederation, @Date, @MeetCountry,
                @MeetState, @MeetTown, @MeetName, @Sanctioned
            )
        `);

        const insertTransaction = db.transaction((rows: any[]) => {
            for (const row of rows) {
                insertStmt.run(row);
            }
        });

        const rows: any[] = [];
        stream
            .pipe(parser)
            .on('data', (row) => {
                rows.push(row);
                if (rows.length >= 500) {
                    insertTransaction(rows);
                    rows.length = 0;
                }
            })
            .on('end', () => {
                if (rows.length > 0) insertTransaction(rows);
                console.log('CSV data successfully inserted into the database.');
            })
            .on('error', (error) => {
                throw new Error(`Error processing CSV data: ${error.message}`);
            });

            // Update the opl_data_version table with the extracted date
            db.prepare(
                `INSERT OR REPLACE INTO opl_data_version (UpdatedDate) VALUES (?)`
            ).run(extractedDate);
            console.log(`Database updated with new version date: ${extractedDate}`);

    } catch (error) {
        console.error('Error processing CSV:', error);
        throw error;
    } finally {
        // Clean up the CSV file after processing
        try {
            await fs.promises.unlink(csvPath);
            console.log('CSV file deleted after processing.');
        } catch (unlinkError) {
            console.error('Error deleting CSV file:', unlinkError);
        }
    }
}
