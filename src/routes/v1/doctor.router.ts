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
  .patch('/me', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorInfo)
  .patch('/avatar', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorAvatar)
  .post('/certificates', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.addDoctorCertificates)
  .patch('/schedule', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorSchedule)
  .patch('/offerings', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.updateDoctorOfferings)
  .patch('/meetings/cancel/:id', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.cancelMeeting)
  .patch('/meetings/confirm/:id', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.confirmMeeting)
  .get('/meetings/:status', auth, checkUserRole(userRole.DOCTOR), doctorCtrl.getlMeetings)

export default router;
