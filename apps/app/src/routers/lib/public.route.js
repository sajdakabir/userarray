import { Router } from "express";
import { getWorkspacePublicProfileController } from "../../controllers/lib/workspace.controller.js";
import { getAllPublicTeamsController } from "../../controllers/lib/team.controller.js";
import { getAllPublicIssuesController } from "../../controllers/lib/issue.controller.js"

const router = Router();

router.route("/workspaces/").get(getWorkspacePublicProfileController)
router.route("/workspaces/:workspace/teams/").get(getAllPublicTeamsController)
router.route("/workspaces/:workspace/issues/").get(getAllPublicIssuesController)
// router.route("/:workspace/teams/:team/issues/:issue/").get(getIssueController)
// router.route("/:workspace/teams/:team/cycles/current/issues/").get(getTeamCurrentCycleIssuesController)


export default router;