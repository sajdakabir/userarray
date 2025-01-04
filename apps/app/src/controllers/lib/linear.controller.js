import { getAccessToken, getLinearTeams, fetchTeamIssues } from "../../services/lib/linear.service.js";

export const getAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const workspace = res.locals.workspace;
    if (!code) {
        return res
            .status(400)
            .json({ error: "Authorization code or user information is missing." });
    }
    try {
        const accessToken = await getAccessToken(code, workspace);

        res.status(200).json({
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

export const getLinearTeamsController = async (req, res, next) => {
    const linearToken = req.headers.lineartoken;
    const teams = await getLinearTeams(linearToken);
    res.status(200).json({
        teams
    });
}

export const getLinearIssuesController = async (req, res, next) => {
    const issues = await fetchTeamIssues("lin_oauth_e85b65d75cf8d4d3f0fa4b15c1789a4d9c189a75a5c5e4b0ba8e31677ae354f0", "be976a32-cd54-4d94-b02e-e15151ae8ab3");
    res.status(200).json({
        issues
    });
}