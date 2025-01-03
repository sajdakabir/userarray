import { getAccessToken } from "../../services/lib/linear.service.js";

export const getAccessTokenController = async (req, res, next) => {
    console.log("hmm")
    const { code } = req.query;
    if (!code || !user) {
        return res
            .status(400)
            .json({ error: "Authorization code or user information is missing." });
    }
    try {
        const accessToken = await getAccessToken(code, user);

        res.status(200).json({
            accessToken
        });
    } catch (err) {
        next(err);
    }
};