
import { Router } from "express";
import { getAccessTokenController, getLinearTeamsController } from "../../controllers/lib/linear.controller.js";
import { WorkspaceMiddleware } from "../../middlewares/workspace.middleware.js";

const router = Router();

router.route('/getLinearTeams/').get(getLinearTeamsController);

router.use("/:workspace", WorkspaceMiddleware)
router.route('/:workspace/getAccessToken/').get(getAccessTokenController);


export default router;