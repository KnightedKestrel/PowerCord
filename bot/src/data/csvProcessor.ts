import * as fs from 'fs';
import * as path from 'path';
import { parseFile } from '@fast-csv/parse';
import DatabaseManager from './database';

export async function csvProcessor(csvPath: string, extractedDate: string): Promise<void> {
    const db = DatabaseManager.getInstance().getDB();

    try {
        console.log(`Processing CSV file: ${csvPath}`);

        // Prepare statements
        const entriesStmt = db.prepare(
            `INSERT OR REPLACE INTO entries (
                MeetID, LifterID, Sex, Event, Equipment, Age, AgeClass, BirthYearClass, Division,
                BodyweightKg, WeightClassKg, Squat1Kg, Squat2Kg, Squat3Kg, Squat4Kg, Best3SquatKg,
                Bench1Kg, Bench2Kg, Bench3Kg, Bench4Kg, Best3BenchKg, Deadlift1Kg, Deadlift2Kg,
                Deadlift3Kg, Deadlift4Kg, Best3DeadliftKg, TotalKg, Place, Wilks, McCulloch,
                Glossbrenner, Goodlift, Wilks2020, Dots, Tested, Country, State
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`
        );

        const meetsStmt = db.prepare(
            `INSERT OR REPLACE INTO meets (
                Federation, MeetDate, MeetCountry, MeetState, MeetTown, MeetName, RuleSet, Sanctioned
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );

        const liftersStmt = db.prepare(
            `INSERT OR REPLACE INTO lifters (
                Name, CyrillicName, ChineseName, GreekName, JapaneseName, KoreanName, Username, Instagram, Color
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        await new Promise<void>((resolve, reject) => {
            parseFile(csvPath, { headers: true })
                .on('error', (error) => {
                    console.error('Error while parsing CSV:', error);
                    reject(error);
                })
                .on('data', (row) => {
                    try {
                        console.log('Processing row:', row);

                        // Insert into meets
                        const meetID = db
                            .prepare(
                                `SELECT MeetID FROM meets WHERE MeetName = ? AND MeetDate = ? AND Federation = ?`
                            )
                            .pluck()
                            .get(row.MeetName, row.Date, row.Federation) || db.prepare(
                                `INSERT INTO meets (
                                    Federation, MeetDate, MeetCountry, MeetState, MeetTown, MeetName, RuleSet, Sanctioned
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                            ).run(
                                row.Federation,
                                row.Date,
                                row.MeetCountry,
                                row.MeetState || null,
                                row.MeetTown || null,
                                row.MeetName,
                                row.RuleSet || null,
                                row.Sanctioned || null
                            ).lastInsertRowid;

                        // Insert into lifters
                        const lifterID = db
                            .prepare(
                                `SELECT LifterID FROM lifters WHERE Name = ? AND Username = ?`
                            )
                            .pluck()
                            .get(row.Name, row.Username) || db.prepare(
                                `INSERT INTO lifters (
                                    Name, CyrillicName, ChineseName, GreekName, JapaneseName, KoreanName, Username, Instagram, Color
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                            ).run(
                                row.Name,
                                row.CyrillicName || null,
                                row.ChineseName || null,
                                row.GreekName || null,
                                row.JapaneseName || null,
                                row.KoreanName || null,
                                row.Username || null,
                                row.Instagram || null,
                                row.Color || null
                            ).lastInsertRowid;

                        // Insert into entries
                        entriesStmt.run(
                            meetID,
                            lifterID,
                            row.Sex,
                            row.Event,
                            row.Equipment,
                            row.Age || null,
                            row.AgeClass || null,
                            row.BirthYearClass || null,
                            row.Division || null,
                            row.BodyweightKg || null,
                            row.WeightClassKg || null,
                            row.Squat1Kg || null,
                            row.Squat2Kg || null,
                            row.Squat3Kg || null,
                            row.Squat4Kg || null,
                            row.Best3SquatKg || null,
                            row.Bench1Kg || null,
                            row.Bench2Kg || null,
                            row.Bench3Kg || null,
                            row.Bench4Kg || null,
                            row.Best3BenchKg || null,
                            row.Deadlift1Kg || null,
                            row.Deadlift2Kg || null,
                            row.Deadlift3Kg || null,
                            row.Deadlift4Kg || null,
                            row.Best3DeadliftKg || null,
                            row.TotalKg || null,
                            row.Place || null,
                            row.Wilks || null,
                            row.McCulloch || null,
                            row.Glossbrenner || null,
                            row.Goodlift || null,
                            row.Wilks2020 || null,
                            row.Dots || null,
                            row.Tested || null,
                            row.Country || null,
                            row.State || null
                        );
                    } catch (insertError) {
                        console.error('Error inserting row:', insertError, 'Row data:', row);
                    }
                })
                .on('end', (rowCount: number) => {
                    console.log(`Finished processing ${rowCount} rows.`);
                    resolve();
                });
        });

        // Update the opl_data_version table with the extracted date
        db.prepare(
            `INSERT OR REPLACE INTO opl_data_version (UpdatedDate) VALUES (?)`
        ).run(extractedDate);
        console.log(`Database updated with new version date: ${extractedDate}`);

        console.log('CSV data successfully saved to the database.');
    } catch (error) {
        console.error('Error processing CSV:', error);
        throw error;
    } finally {
        try {
            await fs.promises.unlink(csvPath);
            console.log(`CSV file deleted: ${csvPath}`);
        } catch (unlinkError) {
            console.error('Error deleting CSV file:', unlinkError);
        }
    }
}
