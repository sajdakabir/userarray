import { createFeedback, getAllFeedback, searchIssue } from '../../services/lib/feedback.service.js';
import { getWorkspaceProfile } from '../../services/lib/workspace.service.js';

export const createFeedbackController  = async (req, res, next) => {        
    try {
        const requestedData = req.body;
        const user = req.user;
        const workspace = await getWorkspaceProfile(req.params.workspace);
        const issue = await createFeedback( requestedData, user, workspace);
        res.status(200).json({ issue });
    } catch (err) {
        next(err)
    }
}

export const getAllFeedbackController = async (req, res, next) => {
    try {
        console.log("hmm");
        const workspace = await getWorkspaceProfile(req.params.workspace);
        const issues = await getAllFeedback(workspace, workspace.teams[0]._id)
        res.status(200).json({ issues })
    } catch (err) {
        next(err)
    }
}

export const searchIssueController = async (req, res, next) => {
    try {
        const workspace = await getWorkspaceProfile(req.params.workspace);
        const issues = await searchIssue(workspace, req.query.q)
        res.status(200).json({ issues })
    } catch (err) {
        next(err)
    }
}