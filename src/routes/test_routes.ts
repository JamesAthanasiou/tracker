import { Request, Response, Router } from 'express';

const dbInMem: any = require('../database/in_memory_db');
const express = require('express');
const router: Router = express.Router();

const numberGenService: () => number = require('../service/number_gen_service');

router.post("/new-number", (req: Request, res: Response) => {
  dbInMem['number'] = numberGenService();
  return res.json({ number: dbInMem['number'] });
});

router.get("/last-number", (req: Request, res: Response) => {
  const result = dbInMem['number'] == null ? 'No number set' : dbInMem['number'];
  return res.json({ number: result });
});

module.exports = router;
