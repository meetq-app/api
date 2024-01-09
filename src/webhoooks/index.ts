import { Router } from 'express';
import idram from './idram.webhook';

const router: Router = Router();

router.use('/idram', idram);

export default router;