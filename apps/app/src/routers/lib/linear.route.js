
import { Router } from "express";
import { getAccessTokenController } from "../../controllers/lib/linear.controller.js";

const router = Router();

router.route('/getAccessToken/').get(getAccessTokenController);

export default router;