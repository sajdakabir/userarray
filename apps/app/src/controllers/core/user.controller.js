import { getUserById, updateUser, updateUserOnBoarded } from "../../services/core/user.service.js";
import { UpdateUserPayload } from "../../payloads/core/user.payload.js";

const userProfileController = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.uuid)
        res.json({
            "status": 200,
            "response": user
        })
    } catch (err) {
        next(err)
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const user = req.user.uuid;
        const { error, value } = UpdateUserPayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const { fullName, userName, avatar, hasFinishedOnboarding, onboarding, timezone } = value;

        await updateUser(user, { fullName, userName, avatar, hasFinishedOnboarding, onboarding, timezone });

        res.json({
            "status": 200,
            "message": "Updated successfully"
        })
    } catch (err) {
        next(err)
    }
};

const updateUserOnBoardedController = async (req, res, next) => {
    try {
        const user = req.user.uuid;
        const { hasFinishedOnboarding } = req.body;

        await updateUserOnBoarded(user, hasFinishedOnboarding);

        res.json({
            "status": 200,
            "message": "User on Boarded"
        })
    } catch (err) {
        next(err)
    }
};

export {
    userProfileController,
    updateUserController,
    updateUserOnBoardedController
};
