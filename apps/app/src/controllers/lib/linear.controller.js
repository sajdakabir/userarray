import { getAccessToken } from "../../services/lib/linear.service.js";

export const getAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    console.log("sajda code : ", code)
    const user = req.user;
    if (!code || !user) {
        return res
            .status(400)
            .json({ error: "Authorization code or user information is missing." });
    }
    try {
        const accessToken = await getAccessToken(code, user);
        // const userInfo = await fetchUserInfo(accessToken, user);

        res.status(200).json({
            accessToken
        });
    } catch (err) {
        next(err);
    }
};