import exp from 'constants';
import path from 'path';
import { Router } from 'express';

const router = Router();

router
  .get('/success', (req, res) => res.sendFile(path.join(__dirname, '../../', 'html', 'success.html')))
  .get('/fail', (req, res) => res.sendFile(path.join(__dirname, '../../', 'html', 'fail.html')))
  .get('/result', (req, res) => res.sendFile(path.join(__dirname, '../../', 'html', 'result.html')))

export default router;
