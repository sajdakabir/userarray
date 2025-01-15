import { Router } from "express";
import { WorkspaceMiddleware } from "../../middlewares/workspace.middleware.js";

import {
  createWorkspaceController,
  WorkSpaceAvailabilityCheckController,
  getUserWorkspacesController,
  getWorkspaceProfileController,
  updateWorkspaceController,
  inviteMemberToWorkspaceController,
  reinviteWorkspaceMembersController,
  getWorkspaceInvitationsController,
  getWorkspaceInvitationByUuidController,
  deleteWorkspaceInvitationByUuidController,
  joinWorkspaceController,
  getAllWorkspaceMembersController,
  getWorkspaceMemberController,
  leaveWorkspaceController,
  deleteWorkspaceController,
  getEverything,
} from "../../controllers/lib/workspace.controller.js";
import {
  createIssuesController,
  getAllIssuesController,
  getIssueController,
  updateIssueController,
  getCurrentCycleIssueController,
  getTeamCurrentCycleIssuesController,
} from "../../controllers/lib/issue.controller.js";
import {
  createTeamController,
  getAllTeamsController,
  updateTeamController,
  deleteTeamController,
} from "../../controllers/lib/team.controller.js";
import {
  getTeamCurrentCyclesController,
} from "../../controllers/lib/cycle.controller.js";
import { createFeedbackController } from "../../controllers/lib/feedback.controller.js";

import {
  createLabelController,
  getLabelsController,
  getLabelController,
  updateLabelController,
  deleteLabelController,
} from "../../controllers/lib/label.controller.js";

const router = Router();

router.route("/").post(createWorkspaceController); //done
router.route("/").get(getUserWorkspacesController); //done
router
  .route("/workspace-slug-check/")
  .get(WorkSpaceAvailabilityCheckController); //done

// feedback controllers below
router.route("/:workspace/feedback/").post(createFeedbackController)

router.use("/:workspace", WorkspaceMiddleware); //done
router.route("/:workspace/").get(getWorkspaceProfileController); //done
router.route("/:workspace/").patch(updateWorkspaceController); //done
router.route("/:workspace/").delete(deleteWorkspaceController); //done

// TODO: need to take a look according to userarray needs

router.route("/:workspace/ping/").get(getEverything);

// workspace member controllers below
router.route("/:workspace/invite/").post(inviteMemberToWorkspaceController);
router.route("/:workspace/invitations/").get(getWorkspaceInvitationsController);
router
  .route("/:workspace/invitations/:invitation/")
  .get(getWorkspaceInvitationByUuidController);
router
  .route("/:workspace/invitations/:invitation/")
  .delete(deleteWorkspaceInvitationByUuidController);
router
  .route("/:workspace/invitations/:invitation/join/")
  .post(joinWorkspaceController);
router.route("/:workspace/members/").get(getAllWorkspaceMembersController);
router.route("/:workspace/members/:member/").get(getWorkspaceMemberController);
// TODO: need to look
router
  .route("/:workspace/members/:member/reinvite/")
  .post(reinviteWorkspaceMembersController);

router.route("/:workspace/members/leave/").delete(leaveWorkspaceController);


// Team controllers below
router.route("/:workspace/teams/").post(createTeamController); //done
router.route("/:workspace/teams/").get(getAllTeamsController); //done
router.route("/:workspace/teams/:team/").patch(updateTeamController); //done
router.route("/:workspace/teams/:team/").delete(deleteTeamController); //done

// cycle controllers below
router.route("/:workspace/cycles/current/").get(getTeamCurrentCyclesController);
router
  .route("/:workspace/cycles/current/issues/")
  .get(getTeamCurrentCycleIssuesController);

// Issue controllers below
router.route("/:workspace/issues/").post(createIssuesController);
router.route("/:workspace/issues/").get(getAllIssuesController);
router.route("/:workspace/issues/cycle").get(getCurrentCycleIssueController);
router.route("/:workspace/issues/:issue/").get(getIssueController);
router.route("/:workspace/issues/:issue/").patch(updateIssueController);

// Labels
router.route("/:workspace/labels/").get(getLabelsController);
router
  .route("/:workspace/labels/:label/")
  .get(getLabelController);
// router
//   .route("/:workspace/spaces/:space/labels/:label/")
//   .patch(updateLabelController);
// router
//   .route("/:workspace/spaces/:space/labels/:label/")
//   .delete(deleteLabelController);

export default router;
