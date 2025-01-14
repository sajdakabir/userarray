import { createFeedback } from '../../services/lib/feedback.service.js';
import { getWorkspaceProfile } from '../../services/lib/workspace.service.js';

export const createFeedbackController  = async (req, res, next) => {        
    try {
        const requestedData = req.body;
        const user = req.user;
        const workspace = await getWorkspaceProfile(req.params.workspace);
        const issue = await createFeedback({ requestedData, user, workspace });
        res.status(200).json({ issue });
    } catch (err) {
        next(err)
    }
}