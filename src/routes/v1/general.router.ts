import { Router } from "express";
import { GeneralController } from "../../controllers/general.controller";
import auth from "../../middleware/auth.middleware";

const generalCtrl = new GeneralController

const router = Router();

router
  .get('/offerings', auth, generalCtrl.getOfferings)
  .get('/user-enums', auth, generalCtrl.getUserEnums)
  .get('/app-enums', auth, generalCtrl.getAppEnums)

export default router;
