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
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

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

  // Convert body to string if it's not already
 //const input = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  const resultStatus = findAllValuesByKey(req.body, 'status');
  const resultID = findAllValuesByKey(req.body, 'id');

  
  if(hasValue(resultStatus))
  {
  console.log("status update recieved");
  console.log("resultID:", resultID);
  console.log("resultStatus:", resultStatus);
  const resultRecipient = findAllValuesByKey(req.body, 'recipient_id');
  console.log("resultStatus:", resultRecipient);
  }else {
      console.log("inbound message recieved");
      console.log("resultID:", resultID);
      const resultFrom = findAllValuesByKey(req.body, 'from');
      console.log("resultFrom:", resultFrom);
      const resultBody = findAllValuesByKey(req.body, 'body');
      console.log("resultFrom:", resultBody);
  }
  


  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});

// Function to extract values by key from concatenated JSON objects
function extractString(jsonString, searchKey) {
  const results = [];
  const regex = /{[^{}]*}/g; // Matches individual JSON objects

  const matches = jsonString.match(regex);
  if (!matches) return results;

  for (const match of matches) {
    try {
      const obj = JSON.parse(match);
      if (searchKey in obj) {
        results.push(obj[searchKey]);
      }
    } catch (e) {
      console.warn("Invalid JSON object skipped:", match);
    }
  }

  return results;
}





// Recursive function to find all values for a given key
function findAllValuesByKey(obj, targetKey, results = []) {
  if (typeof obj !== 'object' || obj === null) return results;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      findAllValuesByKey(item, targetKey, results);
    }
  } else {
    for (const key in obj) {
      if (key === targetKey) {
        results.push(obj[key]);
      }
      findAllValuesByKey(obj[key], targetKey, results);
    }
  }

  return results;
}



function hasValue(str) {
  return typeof str === 'string' && str.trim() !== '';
}


