const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

console.log('Checking database at:', dbPath);

db.serialize(() => {
  db.all("SELECT count(*) as count FROM leaves", (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
    console.log('Total leaves count:', rows[0].count);
  });

  db.all("SELECT * FROM leaves LIMIT 5", (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
    console.log('Sample leaves:', JSON.stringify(rows, null, 2));
    db.close();
    process.exit(0);
  });
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('Timed out waiting for database.');
  process.exit(1);
}, 10000);
