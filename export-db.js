#!/usr/bin/env node
/**
 * Export current database state to SQL file
 * Captures all data from sisoy_booking database
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const outputFile = path.join(__dirname, `sisoy_booking_${timestamp}.sql`);

console.log('📦 Exporting database...');
console.log(`📁 Output: ${outputFile}`);

// Using mysqldump to export the database
const mysqldumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
const command = `"${mysqldumpPath}" -u root --password="" sisoy_booking > "${outputFile}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Export failed:', error.message);
    if (stderr) console.error('Error details:', stderr);
    process.exit(1);
  }

  if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile);
    console.log(`✅ Export completed successfully!`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📍 Location: ${outputFile}`);
  } else {
    console.error('❌ Export file was not created');
    process.exit(1);
  }
});
