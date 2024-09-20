"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
// JTODO this isn't typed, figure out how to use types with TS
const numberGenService = require('../service/number_gen_service');
router.get("/", (req, res) => {
    return res.json({ number: numberGenService() });
});
module.exports = router;
//# sourceMappingURL=test_routes.js.map