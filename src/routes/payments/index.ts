import { Router } from 'express';
import idram from './idram.route';

const router: Router = Router();

router.use('/idram', idram);

export default router;