// Requires.
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const moment  = require('moment');

// Configure Express.
const app = express();
const port = 3001;



const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateLog = () => {
  const date    = new Date();
  const logTypes = ['info', 'warning', 'error'];
  const type    = logTypes[randomIntFromInterval(0, logTypes.length - 1)];
  const message = Array(randomIntFromInterval(5, 15)).fill(null).map(() => 'Lorem ipsum').join(' ');

  const log = { timestamp: date, type: type, message: message };
  fs.appendFileSync(path.join(__dirname, 'app.log'), `${JSON.stringify(log)}\n`, 'utf-8');
};

setInterval(generateLog, 5000);

// The route called by the client app.
app.get('/logs', async (req, res) => {
  const filePath = path.join(__dirname, 'app.log');

  // Make sure that the file exists. If not then create it.
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`new log file created: ${filePath}`);
  } 

  // Read in the log file. 
  const logs = fs.readFileSync(filePath, 'utf-8');

  // Break the file up into lines.
  const lines = logs.split('\n').filter(Boolean);

  let total    = 0;
  let types    = { info: 0, warning: 0, error: 0 };
  let maxWords = { log: '', words: 0 };
  let firstTimestamp;
  let lastTimestamp;

  // Parse each line.
  lines.forEach((line, index) => {
    const log = JSON.parse(line);

    // Add to the total and to the type's total.
    total += 1;
    types[log.type] += 1;

    // Track the word count.
    const words = log.message.split(' ').length;
    if (words > maxWords.words) {
      maxWords = { log: log.message, words: words };
    }

    // First record?
    if (index === 0) { firstTimestamp = moment(log.timestamp); }

    lastTimestamp = moment(log.timestamp);
  });

  // Calculate duration and avg.
  let durationMinutes = 0;
  let avgPerMinute = 0;
  if (firstTimestamp && lastTimestamp) {
    durationMinutes = lastTimestamp.diff(firstTimestamp, 'minutes');
    avgPerMinute = durationMinutes > 0 ? total / durationMinutes : total;
  }

  // Return the completed data.
  res.json({
    total       : total,
    types       : types,
    maxWords    : maxWords,
    avgPerMinute: avgPerMinute
  });

});


app.listen(port, () => console.log(`Server is running on port ${port}`));
