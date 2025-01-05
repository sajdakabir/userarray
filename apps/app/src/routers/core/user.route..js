import { Router } from "express";
import { userProfileController,userProfileDeleteController, updateUserController, updateUserOnBoardedController } from "../../controllers/core/user.controller.js";
import { userWorkSpacesController, getUserWorkspaceInvitationsController } from "../../controllers/lib/workspace.controller.js";

const router = Router();

router.route('/me/').get(userProfileController);
router.route('/me/').delete(userProfileDeleteController);
router.route('/me/').patch(updateUserController);
router.route('/me/onboard/').patch(updateUserOnBoardedController);

// user workspaces
router.route('/me/workspaces/').get(userWorkSpacesController);
router.route('/me/invitations/workspaces/').get(getUserWorkspaceInvitationsController);

export default router;
