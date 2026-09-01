import fs from 'fs';

const filePath = 'D:/report 2.0/service-desk-2026-08-28 (1).csv';
const raw = fs.readFileSync(filePath, 'utf8');
console.log('raw start:', JSON.stringify(raw.slice(0, 60)));
const cleaned = raw
  .replace(/\\uFEFF/gi, '')
  .replace(/\\n/g, '\n')
  .replace(/\\r/g, '\n')
  .replace(/\\t/g, '\t');
console.log('clean start:', JSON.stringify(cleaned.slice(0, 60)));
console.log('first quote index', cleaned.indexOf('"'));
console.log('starts with quote', cleaned.startsWith('"'));
