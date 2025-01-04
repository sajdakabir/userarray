import { getAllIssues } from "../../services/lib/issue.service.js"

export const getAllIssuesController = async (req, res, next) => {
    const workspace = res.locals.workspace
    const { team } = req.params
    const issues = await getAllIssues(workspace, team)
    res.status(200).json({ issues })

}