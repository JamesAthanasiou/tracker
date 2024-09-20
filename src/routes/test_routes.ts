import { Request, Response, Router } from 'express';

const express = require('express');
const router: Router = express.Router();
// JTODO this isn't typed, figure out how to use types with TS
const numberGenService: () => number = require('../service/number_gen_service');

router.get("/", (req: Request, res: Response) => {
  return res.json({ number: numberGenService() });
});

module.exports = router;
