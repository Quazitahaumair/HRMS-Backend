const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const buffer = fs.readFileSync(dbPath);
const content = buffer.toString('binary');

// Look for things that look like emails
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const matches = content.match(emailRegex);

if (matches) {
  const uniqueEmails = [...new Set(matches)];
  fs.writeFileSync('detected_emails.txt', JSON.stringify(uniqueEmails, null, 2));
  console.log('Detected ' + uniqueEmails.length + ' emails.');
} else {
  console.log('No emails detected.');
}
