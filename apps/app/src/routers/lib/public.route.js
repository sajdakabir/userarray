import { Router } from "express";
import { getWorkspacePublicProfileController } from "../../controllers/lib/workspace.controller.js";
import { getAllPublicTeamsController } from "../../controllers/lib/team.controller.js";
import { getAllPublicIssuesController, getPublicTeamCurrentCycleIssuesController, getPublicIssueController } from "../../controllers/lib/issue.controller.js"
import { getAllFeedbackController, searchIssueController } from "../../controllers/lib/feedback.controller.js";
import {
    getLabelsController,
    getLabelController,
  } from "../../controllers/lib/label.controller.js";  


const router = Router();

router.route("/workspaces/").get(getWorkspacePublicProfileController)
router.route("/workspaces/:workspace/teams/").get(getAllPublicTeamsController)



// feedback api here
router.route("/workspaces/:workspace/feedback/").get(getAllFeedbackController)
router.route("/workspaces/:workspace/issue/search/").get(searchIssueController)


// Labels
router.route("/workspaces/:workspace/labels/").get(getLabelsController);
router
  .route("/workspaces/:workspace/labels/:label/")
  .get(getLabelController);


router.route("/workspaces/:workspace/issues/").get(getAllPublicIssuesController)
router.route("/workspaces/:workspace/issues/:issue/").get(getPublicIssueController)
router.route("/:workspace/cycles/current/issues/").get(getPublicTeamCurrentCycleIssuesController)
// router.route("/workspaces/:workspace/feedback/").post(JWTMiddleware, createFeedbackController)


export default router;