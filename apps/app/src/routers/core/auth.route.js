import { Router } from "express";
import { magicLoginController, validateLoginMagicLinkController, authenticateWithGoogleController, logOutController } from "../../controllers/core/auth.controller.js";

const router = Router();
router.route('/magic/login/').post(magicLoginController);
router.route('/magic/verify/').post(validateLoginMagicLinkController);
router.route('/google/login/').post(authenticateWithGoogleController);
router.route('/logout/').post(logOutController);

export default router;
