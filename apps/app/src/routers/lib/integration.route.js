
import { Router } from "express";
import { getAccessTokenController } from "../../controllers/lib/linear.controller.js";
import { WorkspaceMiddleware } from "../../middlewares/workspace.middleware.js";

const router = Router();

router.use("/:workspace", WorkspaceMiddleware)
router.route('/:workspace/getAccessToken/').get(getAccessTokenController);

export default router;