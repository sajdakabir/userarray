import { Router } from "express";
import { WorkspaceMiddleware } from "../../middlewares/workspace.middleware.js";
import { createWorkspaceController, WorkSpaceAvailabilityCheckController, getUserWorkspacesController, getWorkspaceProfileController, updateWorkspaceController, inviteMemberToWorkspaceController, reinviteWorkspaceMembersController, getWorkspaceInvitationsController, getWorkspaceInvitationByUuidController, deleteWorkspaceInvitationByUuidController, joinWorkspaceController, getAllWorkspaceMembersController, getWorkspaceMemberController, leaveWorkspaceController, deleteWorkspaceController, getEverything } from "../../controllers/lib/workspace.controller.js"
import { createSpaceController, getAllSpacesController, getSpaceByNameController, updateSpaceController, daleteSpaceController } from "../../controllers/lib/space.controller.js"
import { createCycleController, getCyclesController, getCycleController, updateCycleController, deleteCycleController, addItemsToCycleController, addUserFavoriteCycleController, getUserFavoriteCyclesController, deleteUserFavoriteCycleController, getCycleItemsController, deleteCycleItemController } from "../../controllers/lib/cycle.controller.js"
import { createItemController, getItemsController, getItemController, updateItemController, deleteItemController, getArchivedItemsController, getArchivedItemController, unarchiveItemController, archiveItemController, getUserWorkSpaceItemsController, getUsersTodayWorkSpaceItemsController, getMembersTodayWorkItemsControlle, getMembersWorkItemsByDateControlle } from "../../controllers/lib/item.controller.js"
import { createLabelController, getLabelsController, getLabelController, updateLabelController, deleteLabelController } from "../../controllers/lib/label.controller.js"
import { createRoadmapController, getRoadmapsController, getRoadmapController, updateRoadmapController, deleteRoadmapController, addItemsToRoadmapController, getRoadmapItemsController, deleteRoadmapItemController } from "../../controllers/lib/roadmap.controller.js"
import { SpaceMiddleware } from "../../middlewares/space.middleware.js";
import { getItemActivityController, getCycleActivityController } from "../../controllers/lib/activity.controller.js";
import { createItemCommentController, getItemCommentsController, updateItemCommentController, deleteItemCommentController, getItemCommentController, createCycleCommentController, getCycleCommentsController, updateCycleCommentController, getCycleCommentController, deleteCycleCommentController } from "../../controllers/lib/comment.controller.js"
import { createUpdateNoteController, getMembersNoteController } from "../../controllers/lib/note.controller.js";

const router = Router();

router.route("/").post(createWorkspaceController)
router.route("/").get(getUserWorkspacesController)
router.route('/workspace-slug-check/').get(WorkSpaceAvailabilityCheckController)

router.use("/:workspace", WorkspaceMiddleware)
router.route("/:workspace/").get(getWorkspaceProfileController)
router.route("/:workspace/").patch(updateWorkspaceController)
router.route("/:workspace/").delete(deleteWorkspaceController)

// TODO: need to take a look according to userarray needs

router.route("/:workspace/ping/").get(getEverything)

// workspace member controllers below
router.route("/:workspace/invite/").post(inviteMemberToWorkspaceController)
router.route("/:workspace/invitations/").get(getWorkspaceInvitationsController)
router.route("/:workspace/invitations/:invitation/").get(getWorkspaceInvitationByUuidController)
router.route("/:workspace/invitations/:invitation/").delete(deleteWorkspaceInvitationByUuidController)
router.route("/:workspace/invitations/:invitation/join/").post(joinWorkspaceController)
router.route("/:workspace/members/").get(getAllWorkspaceMembersController)
router.route("/:workspace/members/:member/").get(getWorkspaceMemberController)
// TODO: need to look
router.route("/:workspace/members/:member/reinvite/").post(reinviteWorkspaceMembersController)

router.route("/:workspace/members/leave/").delete(leaveWorkspaceController)

// Notes controllers below
router.route("/:workspace/notes/create-update/").post(createUpdateNoteController)

// My work
router.route("/:workspace/my/").get(getUserWorkSpaceItemsController)
router.route("/:workspace/today/").get(getUsersTodayWorkSpaceItemsController)

// Team members work item
router.route("/:workspace/items/:member/today/").get(getMembersTodayWorkItemsControlle)
router.route("/:workspace/items/:member/:date/").get(getMembersWorkItemsByDateControlle)
router.route("/:workspace/notes/:member/:date/").get(getMembersNoteController)

// space controllers below
router.route("/:workspace/spaces/").post(createSpaceController)
router.route("/:workspace/spaces/").get(getAllSpacesController)
router.route("/:workspace/spaces/:space/").patch(updateSpaceController)

router.use("/:workspace/spaces/:space", SpaceMiddleware)

router.route("/:workspace/spaces/:space/").get(getSpaceByNameController)
router.route("/:workspace/spaces/:space/").delete(daleteSpaceController)

// Cycle controllers below
router.route("/:workspace/spaces/:space/cycles/").post(createCycleController)
router.route("/:workspace/spaces/:space/cycles/").get(getCyclesController)
router.route("/:workspace/spaces/:space/cycles/:cycle/").get(getCycleController)
router.route("/:workspace/spaces/:space/cycles/:cycle/").patch(updateCycleController)
router.route("/:workspace/spaces/:space/cycles/:cycle/").delete(deleteCycleController)

// // Cycle Archives controllers below // ToDO: need to look
// router.route("/:workspace/spaces/:space/archive/:cycle/").patch(archiveCycleController)

// Cycle Items controllers
router.route("/:workspace/spaces/:space/cycles/:cycle/cycleItems/").post(addItemsToCycleController)
router.route("/:workspace/spaces/:space/cycles/:cycle/cycleItems/").get(getCycleItemsController)
router.route("/:workspace/spaces/:space/cycles/:cycle/cycleItems/:item/").delete(deleteCycleItemController)

// Cycle Favorite controllers
router.route("/:workspace/spaces/:space/user-favorite-cycles/").post(addUserFavoriteCycleController)
router.route("/:workspace/spaces/:space/user-favorite-cycles/").get(getUserFavoriteCyclesController)
router.route("/:workspace/spaces/:space/user-favorite-cycles/:cycle/").delete(deleteUserFavoriteCycleController)

// Items controllers
router.route("/:workspace/spaces/:space/items/").post(createItemController)
router.route("/:workspace/spaces/:space/items/").get(getItemsController)
router.route("/:workspace/spaces/:space/items/:item/").get(getItemController)
router.route("/:workspace/spaces/:space/items/:item/").patch(updateItemController)
router.route("/:workspace/spaces/:space/items/:item/").delete(deleteItemController)

// Items Archives controllers
router.route("/:workspace/spaces/:space/archive/:item/").patch(archiveItemController)
router.route("/:workspace/spaces/:space/archivedItems/").get(getArchivedItemsController)
router.route("/:workspace/spaces/:space/archivedItems/:item/").get(getArchivedItemController)
router.route("/:workspace/spaces/:space/unarchive/:item/").patch(unarchiveItemController)

// Item Activities controller
router.route("/:workspace/spaces/:space/items/:item/history/").get(getItemActivityController)

// Cycle Activites controller
router.route("/:workspace/spaces/:space/cycles/:cycle/history/").get(getCycleActivityController)

// Item Comments controllers
router.route("/:workspace/spaces/:space/items/:item/comments/").post(createItemCommentController)
router.route("/:workspace/spaces/:space/items/:item/comments/").get(getItemCommentsController)
router.route("/:workspace/spaces/:space/items/:item/comments/:comment/").patch(updateItemCommentController)
router.route("/:workspace/spaces/:space/items/:item/comments/:comment/").get(getItemCommentController)
router.route("/:workspace/spaces/:space/items/:item/comments/:comment/").delete(deleteItemCommentController)

// Cycle Comments controllers
router.route("/:workspace/spaces/:space/cycles/:cycle/comments/").post(createCycleCommentController)
router.route("/:workspace/spaces/:space/cycles/:cycle/comments/").get(getCycleCommentsController)
router.route("/:workspace/spaces/:space/cycles/:cycle/comments/:comment/").patch(updateCycleCommentController)
router.route("/:workspace/spaces/:space/cycles/:cycle/comments/:comment/").get(getCycleCommentController)
router.route("/:workspace/spaces/:space/cycles/:cycle/comments/:comment/").delete(deleteCycleCommentController)

// Labels
router.route("/:workspace/spaces/:space/labels/").post(createLabelController)
router.route("/:workspace/spaces/:space/labels/").get(getLabelsController)
router.route("/:workspace/spaces/:space/labels/:label/").get(getLabelController)
router.route("/:workspace/spaces/:space/labels/:label/").patch(updateLabelController)
router.route("/:workspace/spaces/:space/labels/:label/").delete(deleteLabelController)

// Roadmap controllers below
router.route("/:workspace/spaces/:space/roadmaps/").post(createRoadmapController)
router.route("/:workspace/spaces/:space/roadmaps/").get(getRoadmapsController)
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/").get(getRoadmapController)
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/").patch(updateRoadmapController)
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/").delete(deleteRoadmapController)

// Roadmap Items controllers
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/roadmapItems/").post(addItemsToRoadmapController)
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/roadmapItems/").get(getRoadmapItemsController)
router.route("/:workspace/spaces/:space/roadmaps/:roadmap/roadmapItems/:item/").delete(deleteRoadmapItemController)

export default router;
