import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sisoy_booking'
});

try {
  const [tables] = await connection.execute("SHOW TABLES LIKE 'transactions'");
  if (tables.length > 0) {
    console.log('✅ Transactions table exists');
    const [columns] = await connection.execute('DESCRIBE transactions');
    console.log('Columns:', columns.map(c => c.Field).join(', '));
  } else {
    console.log('❌ Transactions table does not exist');
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await connection.end();
}
