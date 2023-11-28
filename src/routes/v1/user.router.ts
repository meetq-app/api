import { Router } from "express";
import { login, verifyLogin } from "../../controllers/auth.controller";
import { getUserInfo } from "../../controllers/user.controller";
import { userRole } from "../../enum/user.enum";
import auth from "../../middleware/auth.middleware";
import checkUserRole from "../../middleware/check-role.middleware";

const router = Router();

router
  // .post('/signup', signup)
  .post('/login', login)
  .post('/verify-login', verifyLogin)
  .get('/me', auth, checkUserRole(userRole.USER), getUserInfo)

export default router;
