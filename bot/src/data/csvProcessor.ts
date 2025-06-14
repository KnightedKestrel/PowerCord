import * as fs from 'fs';
import { parse } from '@fast-csv/parse';
import DatabaseManager from './database';

export async function csvProcessor(
    csvPath: string,
    extractedDate: string,
): Promise<void> {
    const db = DatabaseManager.getInstance().getDB();
    console.log('Processing CSV file:', csvPath);

    const startTime = Date.now();

    try {
        db.exec('PRAGMA synchronous = OFF;');
        db.exec('PRAGMA journal_mode = WAL;');

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

        const stream = fs.createReadStream(csvPath);
        const parser = parse({ headers: true });
        let headersValidated = false;
        const batchSize = 1000;
        const subBatchSize = Math.floor(900 / expectedHeaders.length);
        let rowBuffer: any[] = [];

        db.exec('BEGIN TRANSACTION;');

        stream
            .pipe(parser)
            .on('headers', (headers) => {
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
                    db.prepare('DELETE FROM entries').run();
                }
            })
            .on('data', (row) => {
                if (headersValidated) {
                    rowBuffer.push(row);
                    if (rowBuffer.length >= batchSize) {
                        try {
                            for (
                                let i = 0;
                                i < rowBuffer.length;
                                i += subBatchSize
                            ) {
                                const subBatch = rowBuffer.slice(
                                    i,
                                    i + subBatchSize,
                                );
                                const placeholders = new Array(
                                    expectedHeaders.length,
                                )
                                    .fill('?')
                                    .join(', ');
                                const batchStmt = db.prepare(`
                                    INSERT INTO entries (
                                        Name, Sex, Event, Equipment, Age, AgeClass, BirthYearClass, Division, BodyweightKg, WeightClassKg,
                                        Squat1Kg, Squat2Kg, Squat3Kg, Squat4Kg, Best3SquatKg, Bench1Kg, Bench2Kg, Bench3Kg, Bench4Kg, Best3BenchKg,
                                        Deadlift1Kg, Deadlift2Kg, Deadlift3Kg, Deadlift4Kg, Best3DeadliftKg, TotalKg, Place, Dots, Wilks,
                                        Glossbrenner, Goodlift, Tested, Country, State, Federation, ParentFederation, Date, MeetCountry,
                                        MeetState, MeetTown, MeetName, Sanctioned
                                    ) VALUES ${subBatch.map(() => `(${placeholders})`).join(', ')}
                                `);
                                batchStmt.run(
                                    ...subBatch.flatMap((r) =>
                                        Object.values(r),
                                    ),
                                );
                            }
                            rowBuffer = [];
                        } catch (error) {
                            console.error('Error inserting batch:', error);
                        }
                    }
                }
            })
            .on('end', () => {
                if (rowBuffer.length > 0) {
                    try {
                        for (
                            let i = 0;
                            i < rowBuffer.length;
                            i += subBatchSize
                        ) {
                            const subBatch = rowBuffer.slice(
                                i,
                                i + subBatchSize,
                            );
                            const placeholders = new Array(
                                expectedHeaders.length,
                            )
                                .fill('?')
                                .join(', ');
                            const batchStmt = db.prepare(`
                                INSERT INTO entries (
                                    Name, Sex, Event, Equipment, Age, AgeClass, BirthYearClass, Division, BodyweightKg, WeightClassKg,
                                    Squat1Kg, Squat2Kg, Squat3Kg, Squat4Kg, Best3SquatKg, Bench1Kg, Bench2Kg, Bench3Kg, Bench4Kg, Best3BenchKg,
                                    Deadlift1Kg, Deadlift2Kg, Deadlift3Kg, Deadlift4Kg, Best3DeadliftKg, TotalKg, Place, Dots, Wilks,
                                    Glossbrenner, Goodlift, Tested, Country, State, Federation, ParentFederation, Date, MeetCountry,
                                    MeetState, MeetTown, MeetName, Sanctioned
                                ) VALUES ${subBatch.map(() => `(${placeholders})`).join(', ')}
                            `);
                            batchStmt.run(
                                ...subBatch.flatMap((r) => Object.values(r)),
                            );
                        }
                    } catch (error) {
                        console.error('Error inserting final batch:', error);
                    }
                }

                db.prepare(
                    `INSERT OR REPLACE INTO opl_data_version (UpdatedDate) VALUES (?)`,
                ).run(extractedDate);
                db.exec('COMMIT;');
                console.log(
                    'CSV data successfully inserted into the database.',
                );
                console.log(
                    `Database updated with new version date: ${extractedDate}`,
                );

                const endTime = Date.now();
                const durationSec = ((endTime - startTime) / 1000).toFixed(2);
                console.log(`Processing completed in ${durationSec} seconds`);
            })
            .on('error', (error) => {
                console.error(`Error processing CSV data: ${error.message}`);
                db.exec('ROLLBACK;');
            });
    } catch (error) {
        console.error('Error processing CSV:', error);
        db.exec('ROLLBACK;');
        throw error;
    } finally {
        db.exec('PRAGMA synchronous = NORMAL;');
        db.exec('PRAGMA journal_mode = DELETE;');

        try {
            fs.unlinkSync(csvPath);
            console.log('CSV file deleted after processing.');
        } catch (unlinkError) {
            console.error('Error deleting CSV file:', unlinkError);
        }
    }
}
