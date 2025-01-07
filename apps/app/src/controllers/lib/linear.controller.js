import { getAccessToken, getLinearTeams, fetchCurrentCycle, handleLinearWebhookEvent } from "../../services/lib/linear.service.js";
import crypto from "crypto";
import { environment } from "../../loaders/environment.loader.js";

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
    try {
        const linearToken = req.headers.lineartoken;
        if (!linearToken) {
            return res.status(400).json({ error: "Linear token is missing" });
        }
        const teams = await getLinearTeams(linearToken);
        res.status(200).json({ teams });
    } catch (err) {
        next(err);
    }
}

export const getLinearIssuesController = async (req, res, next) => {
    
    const hmm = await fetchCurrentCycle("", "");
    res.status(200).json({ hmm });
}

export const handleLinearWebhook = async (req, res, next) => {
    const rawBody = req.body.toString();
    const payload = JSON.parse(rawBody);
    const signature = crypto
        .createHmac("sha256", environment.LINER_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    if (signature !== req.headers["linear-signature"]) {
        res.sendStatus(400);
        return;
    }
    try {
        await handleLinearWebhookEvent(payload);
        res.status(200).send("Webhook event processed");
    } catch (err) {
        next(err);
    }

}