import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../../controllers/auth.controller';
import { DoctorController } from '../../controllers/doctor.controller';
import { userCountry, userCurrency, userGender, userRole } from '../../enum/user.enum';
import auth from '../../middleware/auth.middleware';
import checkUserRole from '../../middleware/check-role.middleware';
import cleanseRequest from '../../middleware/cleanse-request.middleware';
import { validateRequest } from '../../middleware/validate-request';
import doctorService from '../../services/doctor.service';

const authCtrl = new AuthController(doctorService);
const doctorCtrl = new DoctorController();

const router = Router();

router
  .post(
    '/login',
    [body('email').isEmail().withMessage('Email must be valid')],
    validateRequest,
    authCtrl.login.bind(authCtrl),
  )
  .post('/verify-login', authCtrl.verifyLogin.bind(authCtrl))
  .get('/me', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.getDoctorInfo)
  .patch(
    '/me',
    auth,
    cleanseRequest('body', [
      'fullName',
      'gender',
      'country',
      'timezone',
      'currency',
      'speciality',
      'info',
    ]),
    [
      body('fullName').optional().trim().isLength({ min: 6, max: 40 }),
      body('speciality').optional().trim().isLength({ min: 6, max: 40 }),
      body('info').optional().trim().isString(),
      body('gender').optional().custom((value) => {
        if (!Object.values(userGender).includes(value)) {
          throw new Error('Invalid gender value');
        }
        return true;
      }),
      body('country').optional().custom((value) => {
        if (!Object.values(userCountry).includes(value)) {
          throw new Error('Invalid country value');
        }
        return true;
      }),
      body('currency').optional().custom((value) => {
        if (!Object.values(userCurrency).includes(value)) {
          throw new Error('Invalid currency value');
        }
        return true;
      }),
    ],
    validateRequest,
    checkUserRole(userRole.DOCTOR),
    doctorCtrl.updateDoctorInfo,
  )
  .patch('/avatar', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorAvatar)
  .post('/certificates', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.addDoctorCertificates)
  .patch('/schedule', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorSchedule)
  .patch('/offerings', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorOfferings)
  .patch('/meetings/cancel/:id', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.cancelMeeting)
  .patch('/meetings/confirm/:id', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.confirmMeeting)
  .get('/meetings/:status', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.getlMeetings)
  .get('/transactions', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.getTransactions)

export default router;
