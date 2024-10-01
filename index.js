// TODO remove. Testing why we're not running correctly on EC2.
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.APP_PORT ?? 3000;

app.get("/", (req, res) => {
  return res.json({ message: "It's working" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
