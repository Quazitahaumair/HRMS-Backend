const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('database.sqlite');
db.all("PRAGMA table_info('users');", (err, rows) => {
  if (err) {
    fs.writeFileSync('db_schema.txt', 'ERROR: ' + err.message);
  } else {
    fs.writeFileSync('db_schema.txt', 'Columns: ' + rows.map(r => r.name).join(', '));
  }
  db.close();
});
