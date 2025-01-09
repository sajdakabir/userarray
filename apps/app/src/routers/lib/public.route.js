import { Router } from "express";
import { getWorkspacePublicProfileController } from "../../controllers/lib/workspace.controller.js";
import { getAllPublicTeamsController } from "../../controllers/lib/team.controller.js";

const router = Router();

router.route("/workspaces/").get(getWorkspacePublicProfileController)
router.route("/workspaces/:workspace/teams/").get(getAllPublicTeamsController)


export default router;