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

db.all("SELECT email FROM users", [], (err, rows) => {
  if (err) {
    console.error('Error querying users:', err.message);
    process.exit(1);
  }
  
  const emails = rows.map(r => r.email);
  fs.writeFileSync('emails_dump.txt', JSON.stringify(emails, null, 2));
  console.log('Dumped ' + emails.length + ' emails to emails_dump.txt');
  db.close();
});
