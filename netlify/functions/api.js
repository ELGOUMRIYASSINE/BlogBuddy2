const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import your routes here
// Note: You'll need to adapt your TypeScript server code for serverless functions

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports.handler = serverless(app);