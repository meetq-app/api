import exp from 'constants';
import { Router } from 'express';

const router = Router();

router
  .get('/success', (req, res) => res.send('ok'))
  .get('/fail', (req, res) => res.send('ok'))
  .get('/result', (req, res) => res.send('ok'));

export default router;
