import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { PatientController } from "../../controllers/patient.controller";
import { userRole } from "../../enum/user.enum";
import auth from "../../middleware/auth.middleware";
import checkUserRole from "../../middleware/check-role.middleware";
import patientService from "../../services/patient.service";

const authCtrl = new AuthController(patientService);
const patientCtrl = new PatientController();

const router = Router();

router
  .post('/login', authCtrl.login.bind(authCtrl))
  .post('/verify-login', authCtrl.verifyLogin.bind(authCtrl))
  .get('/me', auth, checkUserRole(userRole.PATIENT), patientCtrl.getPatientInfo)
  .patch('/', auth, checkUserRole(userRole.PATIENT), patientCtrl.updatePatientInfo)
  .patch('/avatar', auth, checkUserRole(userRole.PATIENT), patientCtrl.updatePatientAvatar)

export default router;
