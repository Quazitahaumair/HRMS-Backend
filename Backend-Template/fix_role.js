const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

const email = 'admin@hrms.local'; // Update this if you use a different admin email

db.run(`UPDATE users SET role = 'admin' WHERE email = ?`, [email], function(err) {
  if (err) {
    return console.error('Error updating role:', err.message);
  }
  if (this.changes > 0) {
    console.log(`✅ Success: User ${email} is now an Admin.`);
  } else {
    console.log(`⚠️ Warning: No user found with email ${email}.`);
  }
  db.close();
});
