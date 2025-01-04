import { Issue } from "../../models/lib/issue.model.js"

export const getAllIssues = async (workspace, team) => {
   const issues = await Issue.find({
      workspace: workspace._id,
      team: team
   })
   return issues
}