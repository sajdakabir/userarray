import { getAllIssues, getIssue } from "../../services/lib/issue.service.js"

export const getAllIssuesController = async (req, res, next) => {
   try {
    const workspace = res.locals.workspace
    const { team } = req.params
    const issues = await getAllIssues(workspace, team)
    res.status(200).json({ issues })
   } catch (err) {
    next(err)
   }
}

export const getIssueController = async (req, res, next) => {
   try {
    const workspace = res.locals.workspace
    const { team, issue:id } = req.params
    const issue = await getIssue(workspace, team, id)
    res.status(200).json({ issue })
   } catch (err) {
    next(err)
   }
}