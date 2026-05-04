const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking user roles in database...');

db.all("SELECT id, firstName, lastName, email, role FROM users", (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.table(rows);
  }
  db.close();
});
