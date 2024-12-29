import { getUserById } from "../services/core/user.service.js";
import { validateUserWithWorkspace, getWorkspaceProfile } from "../services/lib/workspace.service.js";
// import { RedisClient } from "../loaders/redis.loader.js"

// const redisClient = await RedisClient();

const WorkspaceMiddleware = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await getUserById(id)
        const workspace = await getWorkspaceProfile(req.params.workspace)
        const check = await validateUserWithWorkspace(user, workspace)
        if (check) {
            res.locals.user = user;
            res.locals.workspace = workspace;
            next();
        } else {
            const error = new Error("User not authorised")
            error.statusCode = 403
            throw error
        }
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 403;
        next(error);
    }
};

// const WorkspaceMiddleware = async (req, res, next) => {
//     try {
//         const { id } = req.user;

//         let user = await redisClient.get(`user:${id}`);
//         if (!user) {
//             user = await getUserById(id);
//             await redisClient.set(`user:${id}`, JSON.stringify(user));
//         } else {
//             user = JSON.parse(user);
//         }
//         const slug = req.params.workspace;

//         let workspace = await redisClient.get(`workspace:${slug}`);
//         if (!workspace) {
//             workspace = await getWorkspaceProfile(slug);
//             await redisClient.set(`workspace:${slug}`, JSON.stringify(workspace));
//         } else {
//             workspace = JSON.parse(workspace);
//         }

//         const check = await validateUserWithWorkspace(user, workspace);
//         if (check) {
//             res.locals.user = user;
//             res.locals.workspace = workspace;
//             next();
//         } else {
//             const error = new Error("User not authorized");
//             error.statusCode = 403;
//             throw error;
//         }
//     } catch (err) {
//         const error = new Error(err.message);
//         error.statusCode = 403;
//         next(error);
//     }
// };

export {
    WorkspaceMiddleware
};
