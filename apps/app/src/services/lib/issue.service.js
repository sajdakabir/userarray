import { Issue } from "../../models/lib/issue.model.js"

export const getAllIssues = async (workspace, team) => {
   const issues = await Issue.find({
      workspace: workspace._id,
      team: team
   })
   return issues
}

export const getIssue = async (workspace, team, id) => {
   const issue = await Issue.findOne({
      workspace: workspace._id,
      team: team,
      uuid: id
   })
   return issue
}

export const updateIssue = async (workspace, team, issueId, updateData) => {
    const updatedIssue = await Issue.findOneAndUpdate(
        { 
            workspace,
            team,
            _id: issueId 
        },
        { $set: updateData },
        { new: true } 
    )

    if (!updatedIssue) {
        throw new Error('Issue not found')
    }

    return updatedIssue
}

export const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};

export const getCurrentCycleIssue = async (workspace, team) => {
    const cycle = await Issue.findOne({
        workspace: workspace._id,
        team: team
    })
    return cycle
}

export const getTeamCurrentCycleIssues = async (workspace, team) => {
    const currentDate = new Date();
    
    const issues = await Issue.find({
        workspace: workspace,
        team: team,
        isDeleted: false,
        isArchived: false,
        'cycle.startsAt': { $lte: currentDate },
        'cycle.endsAt': { $gte: currentDate }
    }).sort({ createdAt: -1 });
    
    return issues;
};