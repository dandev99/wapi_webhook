// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

      // Example usage:
      //const input = '{"id":1,"status":"ok"}{"id":2,"status":"fail"}{"id":3,"name":"test"}';
      const resultStatus = extractStatuses(req.body,"status");
      console.log("resultStatus:", resultStatus);

      const resultFrom = extractStatuses(req.body,"from");
      console.log("resultFrom:", resultFrom);
  
  res.status(200).end();
});







// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});




function extractString(jsonString,searckKey) {
  const statuses = [];
  const regex = /{[^{}]*}/g; // Matches individual JSON objects

  const matches = jsonString.match(regex);
  if (!matches) return statuses;

  for (const match of matches) {
    try {
      const obj = JSON.parse(match);
      if (searckKey in obj) {
        statuses.push(obj.status);
      }
    } catch (e) {
      console.warn("Invalid JSON object skipped:", match);
    }
  }

  return statuses;
}



