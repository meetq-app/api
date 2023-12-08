import { Router } from 'express';
import patient from './patient.router';
import doctors from './doctor.router';
import generals from './general.router';

const router: Router = Router();

router.use('/patients', patient);
router.use('/doctors', doctors);
router.use('/generals', generals);

export default router;