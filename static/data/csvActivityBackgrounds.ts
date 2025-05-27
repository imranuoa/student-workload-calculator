// // src/lib/data/csvData.ts
// import { writable, type Writable } from 'svelte/store';
// // import  {csv}  from 'd3-fetch';
// import  type {DSVParsedArray}  from 'd3-dsv';
// import {csv} from 'd3-fetch'; // Corrected import

// // Define the type for your CSV data rows
// export interface CsvRow {
//   activity: string;
//   background: string;
// }

// export const data: Writable<DSVParsedArray<CsvRow>| null> = writable(null);

// export async function loadCsvData(filePath: string = '/src/lib/data/activity_backgrounds.csv'): Promise<void> {
//   try {
//     const response = await fetch(filePath);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch CSV: ${response.status}`);
//     }
//     const text = await response.text();
//     const parsedData: DSVParsedArray<CsvRow> = csv.parse(text);
//     data.set(parsedData);
//   } catch (error) {
//     console.error('Error loading CSV data:', error);
//     data.set(null);
//   }
// }

// src/lib/data/csvData.ts
import { writable, type Writable } from 'svelte/store';
import { dsvFormat } from 'd3-dsv';  // Add this import
import type { DSVParsedArray } from 'd3-dsv';
import { base } from '$app/paths';

export interface CsvRow {
  activity: string;
  background: string;
}

export const data: Writable<DSVParsedArray<CsvRow> | null> = writable(null);

export async function loadCsvData(filePath: string = '/data/activity_backgrounds.csv'): Promise<void> {
  try {
    // Create a CSV parser instance
    const csvParser = dsvFormat(',');

    // Fetch and parse
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.status}`);
    
    const text = await response.text();
    const parsedData = csvParser.parse(text) as DSVParsedArray<CsvRow>;
    
    data.set(parsedData);
  } catch (error) {
    console.error('Error loading CSV data:', error);
    data.set(null);
  }
}