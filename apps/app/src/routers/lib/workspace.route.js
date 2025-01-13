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
import {
  createItemController,
  getItemsController,
  getItemController,
  updateItemController,
  deleteItemController,
  getArchivedItemsController,
  getArchivedItemController,
  unarchiveItemController,
  archiveItemController,
  getMembersTodayWorkItemsControlle,
  getMembersWorkItemsByDateControlle,
} from "../../controllers/lib/item.controller.js";
import {
  createLabelController,
  getLabelsController,
  getLabelController,
  updateLabelController,
  deleteLabelController,
} from "../../controllers/lib/label.controller.js";

import {
  getItemActivityController,
  getCycleActivityController,
} from "../../controllers/lib/activity.controller.js";
import {
  createItemCommentController,
  getItemCommentsController,
  updateItemCommentController,
  deleteItemCommentController,
  getItemCommentController,
} from "../../controllers/lib/comment.controller.js";

const router = Router();

router.route("/").post(createWorkspaceController); //done
router.route("/").get(getUserWorkspacesController); //done
router
  .route("/workspace-slug-check/")
  .get(WorkSpaceAvailabilityCheckController); //done

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

// Team members work item
router
  .route("/:workspace/items/:member/today/")
  .get(getMembersTodayWorkItemsControlle);
router
  .route("/:workspace/items/:member/:date/")
  .get(getMembersWorkItemsByDateControlle);

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
router.route("/:workspace/issues/").get(getAllIssuesController);
router.route("/:workspace/issues/cycle").get(getCurrentCycleIssueController);
router.route("/:workspace/issues/:issue/").get(getIssueController);
router.route("/:workspace/issues/:issue/").patch(updateIssueController);

// Items controllers
router.route("/:workspace/spaces/:space/items/").post(createItemController);
router.route("/:workspace/spaces/:space/items/").get(getItemsController);
router.route("/:workspace/spaces/:space/items/:item/").get(getItemController);
router
  .route("/:workspace/spaces/:space/items/:item/")
  .patch(updateItemController);
router
  .route("/:workspace/spaces/:space/items/:item/")
  .delete(deleteItemController);

// Items Archives controllers
router
  .route("/:workspace/spaces/:space/archive/:item/")
  .patch(archiveItemController);
router
  .route("/:workspace/spaces/:space/archivedItems/")
  .get(getArchivedItemsController);
router
  .route("/:workspace/spaces/:space/archivedItems/:item/")
  .get(getArchivedItemController);
router
  .route("/:workspace/spaces/:space/unarchive/:item/")
  .patch(unarchiveItemController);

// Item Activities controller
router
  .route("/:workspace/spaces/:space/items/:item/history/")
  .get(getItemActivityController);

// Cycle Activites controller
router
  .route("/:workspace/spaces/:space/cycles/:cycle/history/")
  .get(getCycleActivityController);

// Item Comments controllers
router
  .route("/:workspace/spaces/:space/items/:item/comments/")
  .post(createItemCommentController);
router
  .route("/:workspace/spaces/:space/items/:item/comments/")
  .get(getItemCommentsController);
router
  .route("/:workspace/spaces/:space/items/:item/comments/:comment/")
  .patch(updateItemCommentController);
router
  .route("/:workspace/spaces/:space/items/:item/comments/:comment/")
  .get(getItemCommentController);
router
  .route("/:workspace/spaces/:space/items/:item/comments/:comment/")
  .delete(deleteItemCommentController);

// Labels
router.route("/:workspace/spaces/:space/labels/").post(createLabelController);
router.route("/:workspace/spaces/:space/labels/").get(getLabelsController);
router
  .route("/:workspace/spaces/:space/labels/:label/")
  .get(getLabelController);
router
  .route("/:workspace/spaces/:space/labels/:label/")
  .patch(updateLabelController);
router
  .route("/:workspace/spaces/:space/labels/:label/")
  .delete(deleteLabelController);

export default router;
