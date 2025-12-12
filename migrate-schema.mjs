import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'backend', 'sql', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon but handle statements carefully
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && !s.startsWith('/*') && !s.startsWith('USE'));

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sisoy_booking',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log('Running schema migration...');
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          console.log(`Executing: ${statement.substring(0, 80)}...`);
          await connection.execute(statement);
          console.log('✓ Success');
        } catch (err) {
          if (err.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠ Table already exists (safe to ignore)');
          } else {
            console.error('Error:', err.message);
          }
        }
      }
    }
    console.log('\n✅ Schema migration completed');
    await connection.end();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

runMigration();
