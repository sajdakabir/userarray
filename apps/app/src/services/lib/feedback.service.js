import { Issue } from "../../models/lib/issue.model.js";

export const createFeedback = async (requestedData, user, workspace) => {  
    const linearTeamId = workspace.integration.teamId;     

    const newIssue = new Issue({
        ...requestedData,
        source: "feedback",
        createdBy: user.id,
        workspace: workspace._id,
        team: workspace.teams[0]._id,
    });
    const issue = await newIssue.save();
    return issue;
}

export const getAllFeedback = async (workspace, team) => {
    const issues = await Issue.find({
        workspace: workspace._id,
        team: team,
        source: "feedback"
    });
    return issues;
}