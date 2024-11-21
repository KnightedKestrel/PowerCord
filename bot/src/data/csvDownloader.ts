import axios from 'axios';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import unzipper from 'unzipper';
import DatabaseManager from './database';

const ZIP_URL =
    'https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip';
const DOWNLOAD_DIR = path.resolve(__dirname, './downloads');
const ZIP_PATH = path.join(DOWNLOAD_DIR, 'openpowerlifting-latest.zip');

export async function csvDownloader(): Promise<void> {
    try {
        // Ensure the downloads directory exists
        await fsp.mkdir(DOWNLOAD_DIR, { recursive: true });

        console.log('Downloading the latest ZIP file...');
        const response = await axios({
            url: ZIP_URL,
            method: 'GET',
            responseType: 'stream',
        });

        // Save the downloaded ZIP file
        await new Promise<void>((resolve, reject) => {
            const writer = fs.createWriteStream(ZIP_PATH);

            response.data.pipe(writer);

            writer.on('finish', () => {
                console.log('Download complete. File saved to:', ZIP_PATH);
                resolve();
            });

            writer.on('error', (error: any) => {
                console.error('Error writing file:', error);
                reject(error);
            });
        });

        // Extract the ZIP file
        console.log('Extracting the ZIP file...');
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(ZIP_PATH)
                .pipe(unzipper.Extract({ path: DOWNLOAD_DIR }))
                .on('close', resolve)
                .on('error', reject);
        });

        console.log(
            'Extraction complete. Contents are in the downloads directory.',
        );

        // Get the unzipped folder name (assuming only one directory is created)
        const files = await fsp.readdir(DOWNLOAD_DIR);
        const datedFolder = files.find(
            (file) =>
                file.startsWith('openpowerlifting-') &&
                fs.lstatSync(path.join(DOWNLOAD_DIR, file)).isDirectory(),
        );

        if (!datedFolder) {
            throw new Error(
                'Could not find a valid dated folder in the extracted contents.',
            );
        }

        console.log(`Found dated folder: ${datedFolder}`);

        // Extract the date from the folder name
        const dateMatch = datedFolder.match(
            /openpowerlifting-(\d{4}-\d{2}-\d{2})/,
        );
        if (!dateMatch) {
            throw new Error(
                `Could not extract a date from folder name: ${datedFolder}`,
            );
        }

        const extractedDate = dateMatch[1]; // e.g., '2024-11-16'
        console.log(`Extracted date: ${extractedDate}`);

        // Check the database for the current date
        const db = DatabaseManager.getInstance().getDB();
        const currentDate = db
            .prepare('SELECT UpdatedDate FROM opl_data_version LIMIT 1')
            .pluck()
            .get();

        if (currentDate === extractedDate) {
            console.log(
                'The CSV data is already up-to-date. No further action needed.',
            );
            return;
        }

        // Update the database with the new date
        db.prepare(
            'INSERT OR REPLACE INTO opl_data_version (UpdatedDate) VALUES (?)',
        ).run(extractedDate);
        console.log(`Database updated with new date: ${extractedDate}`);
    } catch (error) {
        console.error(
            'An error occurred during the CSV download or processing:',
            error,
        );
    } finally {
        // Clean up the temporary files
        try {
            console.log('Cleaning up temporary files...');
            await fsp.rm(DOWNLOAD_DIR, { recursive: true, force: true });
            console.log('Temporary files cleaned up.');
        } catch (cleanupError) {
            console.error('Error cleaning up temporary files:', cleanupError);
        }
    }
}
