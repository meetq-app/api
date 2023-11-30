import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { DoctorController } from "../../controllers/doctor.controller";
import { userRole } from "../../enum/user.enum";
import auth from "../../middleware/auth.middleware";
import checkUserRole from "../../middleware/check-role.middleware";
import doctorService from "../../services/doctor.service";

const authCtrl = new AuthController(doctorService);
const doctorCtrl = new DoctorController();

const router = Router();

router
  .post('/login', authCtrl.login.bind(authCtrl))
  .post('/verify-login', authCtrl.verifyLogin.bind(authCtrl))
  .get('/me', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.getDoctorInfo)
  .patch('/', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorInfo)

export default router;
