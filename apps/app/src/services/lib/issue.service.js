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