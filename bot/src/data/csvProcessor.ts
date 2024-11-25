import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@fast-csv/parse';
import DatabaseManager from './database';

export async function csvProcessor(
    csvPath: string,
    extractedDate: string,
): Promise<void> {
    const db = DatabaseManager.getInstance().getDB();

    console.log('Processing CSV file:', csvPath);

    try {
        // Ensure the headers match the expected schema
        const expectedHeaders = [
            'Name',
            'Sex',
            'Event',
            'Equipment',
            'Age',
            'AgeClass',
            'BirthYearClass',
            'Division',
            'BodyweightKg',
            'WeightClassKg',
            'Squat1Kg',
            'Squat2Kg',
            'Squat3Kg',
            'Squat4Kg',
            'Best3SquatKg',
            'Bench1Kg',
            'Bench2Kg',
            'Bench3Kg',
            'Bench4Kg',
            'Best3BenchKg',
            'Deadlift1Kg',
            'Deadlift2Kg',
            'Deadlift3Kg',
            'Deadlift4Kg',
            'Best3DeadliftKg',
            'TotalKg',
            'Place',
            'Dots',
            'Wilks',
            'Glossbrenner',
            'Goodlift',
            'Tested',
            'Country',
            'State',
            'Federation',
            'ParentFederation',
            'Date',
            'MeetCountry',
            'MeetState',
            'MeetTown',
            'MeetName',
            'Sanctioned',
        ];

        // Read and validate headers from the CSV
        const stream = fs.createReadStream(csvPath);
        const parser = parse({ headers: true });

        let headersValidated = false;

        // Define the insert statement
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

        stream
            .pipe(parser)
            .on('headers', (headers) => {
                // Validate the headers
                headersValidated =
                    JSON.stringify(headers) === JSON.stringify(expectedHeaders);
                if (!headersValidated) {
                    stream.destroy(
                        new Error(
                            'CSV headers do not match the expected schema.',
                        ),
                    );
                } else {
                    console.log(
                        'Headers validated successfully. Clearing the table.',
                    );
                    // Clear the `entries` table before inserting new data
                    db.prepare('DELETE FROM entries').run();
                }
            })
            .on('data', (row) => {
                if (headersValidated) {
                    try {
                        // Insert each row into the database immediately
                        insertStmt.run(row);
                    } catch (error) {
                        console.error('Error inserting row:', error);
                    }
                }
            })
            .on('end', () => {
                console.log(
                    'CSV data successfully inserted into the database.',
                );

                // Update the opl_data_version table with the extracted date
                db.prepare(
                    `INSERT OR REPLACE INTO opl_data_version (UpdatedDate) VALUES (?)`,
                ).run(extractedDate);
                console.log(
                    `Database updated with new version date: ${extractedDate}`,
                );
            })
            .on('error', (error) => {
                console.error(`Error processing CSV data: ${error.message}`);
            });
    } catch (error) {
        console.error('Error processing CSV:', error);
        throw error;
    } finally {
        // Clean up the CSV file after processing
        try {
            console.log('CSV file deleted after processing.');
        } catch (unlinkError) {
            console.error('Error deleting CSV file:', unlinkError);
        }
    }
}
