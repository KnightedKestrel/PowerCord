import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import unzipper from 'unzipper';
import logger from '../logger';
import DatabaseManager from './database';

const ZIP_URL =
    'https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip';
const DOWNLOAD_DIR = path.resolve(__dirname, './downloads');
const ZIP_PATH = path.join(DOWNLOAD_DIR, 'openpowerlifting-latest.zip');

async function getLastUpdate(): Promise<string> {
    try {
        const url = 'https://openpowerlifting.gitlab.io/opl-csv/bulk-csv.html';
        const response = await axios.get(url);
        const cheer = cheerio.load(response.data);
        const updatedText = cheer(
            'body > div > div > div > div > main > ul > li',
        )
            .first()
            .text()
            .trim();
        const noDotText = updatedText.replace('.', '');
        const dateText = noDotText.replace('Updated:', '').trim();

        if (!dateText) {
            logger.info(updatedText);
            throw new Error('Could not find the date on the specified page.');
        }

        logger.info(`Last CSV Update: ${dateText}`);
        return dateText;
    } catch (error) {
        logger.error('Failed to fetch updated date:', error);
        throw error;
    }
}

export async function csvDownloader(): Promise<{
    csvPath: string;
    extractedDate: string;
}> {
    const db = DatabaseManager.getInstance().getDB();

    try {
        // Compare dates
        const getDate = await getLastUpdate();

        const currentDate = db
            .prepare('SELECT UpdatedDate FROM opl_data_version LIMIT 1')
            .pluck()
            .get();

        if (currentDate === getDate) {
            logger.info('The CSV data is already up-to-date.');
            await fsp.rm(DOWNLOAD_DIR, { recursive: true, force: true });
            logger.info('Temporary files cleaned up.');
            return { csvPath: '', extractedDate: '' };
        } else {
            logger.info('DB:', currentDate, 'CSV:', getDate);
        }

        // ZIP download
        await fsp.mkdir(DOWNLOAD_DIR, { recursive: true });

        logger.info('Downloading the latest ZIP file...');
        const response = await axios({
            url: ZIP_URL,
            method: 'GET',
            responseType: 'stream',
        });

        await new Promise<void>((resolve, reject) => {
            const writer = fs.createWriteStream(ZIP_PATH);
            response.data.pipe(writer);

            writer.on('finish', () => {
                logger.info('Download complete. File saved to:', ZIP_PATH);
                resolve();
            });

            writer.on('error', (error: any) => {
                logger.error('Error writing file:', error);
                reject(error);
            });
        });

        // Extract ZIP
        logger.info('Extracting the ZIP file...');
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(ZIP_PATH)
                .pipe(unzipper.Extract({ path: DOWNLOAD_DIR }))
                .on('close', resolve)
                .on('error', reject);
        });

        logger.info('Extraction complete.');
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

        logger.info(`Found dated folder: ${datedFolder}`);
        const extractedDate = getDate;
        // const extractedDate = datedFolder.match(
        //     /openpowerlifting-(\d{4}-\d{2}-\d{2})/,
        // )?.[1];

        if (!extractedDate) {
            throw new Error(
                `Could not extract a date from folder name: ${datedFolder}`,
            );
        }

        // Find CSV
        const extractedPath = path.join(DOWNLOAD_DIR, datedFolder);
        const extractedFiles = await fsp.readdir(extractedPath);
        const csvFileName = extractedFiles.find((file) =>
            file.endsWith('.csv'),
        );

        if (!csvFileName) {
            throw new Error('No CSV file found in the extracted folder.');
        }

        const csvPath = path.join(extractedPath, csvFileName);
        logger.info(`CSV ready for processing: ${csvPath}`);
        return { csvPath, extractedDate };
    } catch (error) {
        logger.error(
            'An error occurred during CSV download or processing:',
            error,
        );
        throw error;
    } finally {
        // Cleanup
        await fsp.access(ZIP_PATH);
        logger.info('Deleting ZIP file...');
        await fsp.unlink(ZIP_PATH);
    }
}
