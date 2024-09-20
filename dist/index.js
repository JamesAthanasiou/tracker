"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express = require('express');
const app = express();
const testRoutes = require('./routes/test_routes');
const port = process.env.APP_PORT;
app.get("/", (req, res) => {
    return res.json({ message: "Hello world!!!" });
});
app.use('/test', testRoutes);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map