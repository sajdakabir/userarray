import { getSpaceByName } from "../services/lib/workspace.service.js";

const SpaceMiddleware = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const space = await getSpaceByName(workspace, req.params.space);
        res.locals.space = space;
        next();
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 403;
        next(error);
    }
};

export {
    SpaceMiddleware
};
