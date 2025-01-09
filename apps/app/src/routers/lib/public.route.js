import { Router } from "express";
import { getWorkspacePublicProfileController } from "../../controllers/lib/workspace.controller.js";

const router = Router();

router.route("/workspaces/").get(getWorkspacePublicProfileController)


export default router;