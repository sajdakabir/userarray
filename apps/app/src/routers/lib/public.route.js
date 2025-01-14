import { Router } from "express";
import { getWorkspacePublicProfileController } from "../../controllers/lib/workspace.controller.js";
import { getAllPublicTeamsController } from "../../controllers/lib/team.controller.js";
import { getAllPublicIssuesController, getPublicTeamCurrentCycleIssuesController } from "../../controllers/lib/issue.controller.js"
import { getAllFeedbackController } from "../../controllers/lib/feedback.controller.js";


const router = Router();

router.route("/workspaces/").get(getWorkspacePublicProfileController)
router.route("/workspaces/:workspace/teams/").get(getAllPublicTeamsController)
router.route("/workspaces/:workspace/issues/").get(getAllPublicIssuesController)
// router.route("/:workspace/teams/:team/issues/:issue/").get(getIssueController)
router.route("/:workspace/cycles/current/issues/").get(getPublicTeamCurrentCycleIssuesController)
// router.route("/workspaces/:workspace/feedback/").post(JWTMiddleware, createFeedbackController)



// write the feedback api here
router.route("/workspaces/:workspace/feedback/").get(getAllFeedbackController)

export default router;