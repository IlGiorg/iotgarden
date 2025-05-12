const express = require('express');
const fs = require('fs');
const path = require('path');

let Gpio;

if (process.platform !== 'linux') {
  console.log('Mocking GPIO on non-Linux platform');
  Gpio = class {
    constructor(pin, direction) {
      console.log(`Mock GPIO setup: pin ${pin}, direction ${direction}`);
    }
    writeSync(value) {
      console.log(`Mock writeSync(${value})`);
    }
    readSync() {
      const val = 1; // simulate wet soil
      console.log(`Mock readSync() => ${val}`);
      return val;
    }
    unexport() {
      console.log('Mock unexport()');
    }
  };
} else {
  Gpio = require('onoff').Gpio;
}

const app = express();
const port = 3000;

// GPIO setup
const moistureSensor = new Gpio(17, 'in');  // Replace with your pin
const relay = new Gpio(27, 'out');          // Replace with your pin

const LOG_FILE = 'moisture_log.json';
const AUTO_THRESHOLD = 1; // 0 = dry, 1 = wet
const WATER_LOG_FILE = 'watering_log.json';

function logWateringEvent(type) {
    const timestamp = new Date().toISOString();
    let log = [];
    if (fs.existsSync(WATER_LOG_FILE)) {
        log = JSON.parse(fs.readFileSync(WATER_LOG_FILE));
    }

    log.push({ timestamp, type });

    if (log.length > 100) log = log.slice(-100);
    fs.writeFileSync(WATER_LOG_FILE, JSON.stringify(log));
}

app.use(express.static('public'));
app.use(express.json());

function waterPlant(duration = 5000, type = 'auto') {
    relay.writeSync(1);
    setTimeout(() => relay.writeSync(0), duration);
    logWateringEvent(type);
}

function logMoisture() {
    const moisture = moistureSensor.readSync();
    const timestamp = new Date().toISOString();

    let log = [];
    if (fs.existsSync(LOG_FILE)) {
        log = JSON.parse(fs.readFileSync(LOG_FILE));
    }

    log.push({ timestamp, moisture });

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    log = log.filter(entry => new Date(entry.timestamp).getTime() > cutoff);

    fs.writeFileSync(LOG_FILE, JSON.stringify(log));
    return moisture;
}

setInterval(() => {
    const moisture = logMoisture();
    if (moisture < AUTO_THRESHOLD) {
        console.log('Dry soil detected. Watering...');
        waterPlant();
    }
}, 60000);

app.get('/data', (req, res) => {
    const data = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE)) : [];
    res.json(data);
});

app.post('/water', (req, res) => {
    waterPlant(5000, 'manual');
    res.json({ status: 'Watered manually' });
});

app.get('/watering-log', (req, res) => {
    const data = fs.existsSync(WATER_LOG_FILE) ? JSON.parse(fs.readFileSync(WATER_LOG_FILE)) : [];
    res.json(data);
});

app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});
