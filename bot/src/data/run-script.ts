// Example content for run-script.ts

import DatabaseManager from './database';
import { csvProcessor } from './csvProcessor'; // Replace with your file name

async function main() {
	const dbManager = DatabaseManager.getInstance();
	
	await dbManager.createDB();
	
    const csvFilePath = './powerlifting_data.csv'; // Provide the path to your CSV file
    const extractedDate = '2024-11-21'; // Provide the extracted date, if needed
    
    try {
        await csvProcessor(csvFilePath, extractedDate);
    } catch (error) {
        console.error('Error running CSV processor:', error);
    }
}

main();
