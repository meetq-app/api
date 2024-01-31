import { Router } from 'express';
import { body, query } from 'express-validator';
import { AuthController } from '../../controllers/auth.controller';
import { PatientController } from '../../controllers/patient.controller';
import {
  userCountry,
  userCurrency,
  userGender,
  userLanguage,
  userRole,
} from '../../enum/user.enum';
import auth from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';
import checkUserRole from '../../middleware/check-role.middleware';
import patientService from '../../services/patient.service';
import cleanseRequest from '../../middleware/cleanse-request.middleware';

const authCtrl = new AuthController(patientService);
const patientCtrl = new PatientController();

const router = Router();

router
  .post(
    '/login',
    [body('email').isEmail().withMessage('Email must be valid')],
    validateRequest,
    authCtrl.login.bind(authCtrl),
  )
  .post(
    '/verify-login',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('code')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('Code must be 6 characters long'),
    ],
    validateRequest,
    authCtrl.verifyLogin.bind(authCtrl),
  )
  .get('/me', auth, checkUserRole(userRole.PATIENT), patientCtrl.getPatientInfo)
  .patch(
    '/me',
    auth,
    cleanseRequest('body', ['fullName', 'gender', 'country', 'timezone', 'currency']),
    [
      body('fullName').optional().trim().isLength({ min: 6, max: 40 }),
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
      // body('currency').optional().custom((value) => {
      //   if (!Object.values(userCurrency).includes(value)) {
      //     throw new Error('Invalid currency value');
      //   }
      //   return true;
      // }),
    ],
    validateRequest,
    checkUserRole(userRole.PATIENT),
    patientCtrl.updatePatientInfo,
  )
  .patch('/avatar', auth, checkUserRole(userRole.PATIENT), patientCtrl.updatePatientAvatar)
  .get(
    '/doctors',
    cleanseRequest('query', [
      'limit',
      'sort',
      'speciality',
      'sortField',
      'languages',
      'offerings',
      'search',
    ]),
    [
      query('limit').optional().isInt().withMessage('Limit must be an integer'),

      query('sort').optional().isIn(['ASC', 'DESC']).withMessage('Sort must be ASC or DESC'),

      query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string')
        .isLength({ max: 60 })
        .withMessage('search must be at most 60 characters'),

      query('speciality')
        .optional()
        .isString()
        .withMessage('Speciality must be a string')
        .isLength({ max: 60 })
        .withMessage('Speciality must be at most 60 characters'),

      query('sortField')
        .optional()
        .isIn(['raiting', 'name'])
        .withMessage('Sort field must be raiting or name'),

      query('offerings')
        .optional()
        .notEmpty()
        .withMessage('offerings parameter can not be empty')
        .custom((value) => {
          try {
            const parsedOfferings = JSON.parse(value);

            if (!Array.isArray(parsedOfferings)) {
              throw new Error('offerings must be an array');
            }

            return true;
          } catch (err) {
            throw new Error('Invalid JSON format for languages');
          }
        }),

      query('languages')
        .optional()
        .notEmpty()
        .withMessage('Languages parameter can not be empty')
        .custom((value) => {
          try {
            const parsedLanguages = JSON.parse(value);

            if (!Array.isArray(parsedLanguages)) {
              throw new Error('Languages must be an array');
            }

            if (parsedLanguages.some((lang) => !Object.values(userLanguage).includes(lang))) {
              throw new Error('Invalid language detected');
            }

            return true;
          } catch (err) {
            throw new Error('Invalid JSON format for languages');
          }
        }),
    ],
    validateRequest,
    patientCtrl.getDoctors,
  )
  .get(
    '/doctors/slots/:id/:date',
    auth,
    checkUserRole(userRole.PATIENT),
    patientCtrl.getDoctorsTimeSlots,
  )
  .get('/doctors/:id', patientCtrl.getDoctor)
  .post('/doctors/book', auth, checkUserRole(userRole.PATIENT), patientCtrl.bookMeeting)
  .patch('/meetings/cancel/:id', auth, checkUserRole(userRole.PATIENT), patientCtrl.cancelMeeting)
  .patch('/meetings/finish/:id', auth, checkUserRole(userRole.PATIENT), patientCtrl.finishMeeting)
  .get('/meetings/:status', auth, checkUserRole(userRole.PATIENT), patientCtrl.getMeetings)
  .get('/transactions', auth, checkUserRole(userRole.PATIENT), patientCtrl.getTransactions)

export default router;
