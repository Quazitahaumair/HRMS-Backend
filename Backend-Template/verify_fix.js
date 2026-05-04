const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

db.get("SELECT email, role FROM users WHERE email = 'admin@hrms.local'", (err, row) => {
  if (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
  if (row) {
    console.log(`VERIFICATION: User ${row.email} has role: ${row.role}`);
  } else {
    console.log('VERIFICATION: Admin user not found.');
  }
  db.close();
  process.exit(0);
});

// Safety timeout
setTimeout(() => {
  console.log('VERIFICATION: Timed out. Database might still be locked.');
  process.exit(1);
}, 3000);
