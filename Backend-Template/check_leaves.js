const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.all("SELECT * FROM leaves ORDER BY createdAt DESC LIMIT 5", [], (err, rows) => {
  if (err) {
    console.error('Error querying leaves:', err.message);
    process.exit(1);
  }
  
  fs.writeFileSync('leaves_check.txt', JSON.stringify(rows, null, 2));
  console.log('Checked ' + rows.length + ' leaves.');
  db.close();
});
