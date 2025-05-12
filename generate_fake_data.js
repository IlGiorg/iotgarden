const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'moisture_log.json');
const now = Date.now();

const data = [];

for (let i = 0; i < 48; i++) { // 48 points for 24 hours, every 30 min
  const timestamp = new Date(now - (48 - i) * 30 * 60 * 1000).toISOString();
  const moisture = Math.floor(250 + Math.random() * 150); // random value 250-400
  data.push({ timestamp, moisture });
}

fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2));
console.log(`Fake data written to ${LOG_FILE}`);
