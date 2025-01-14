import AuthRouter from "./core/auth.route.js";
import { JWTMiddleware } from "../middlewares/jwt.middleware.js";
import WorkspacesRouter from "./lib/workspace.route.js";
import UserRouter from "./core/user.route..js";
import IntegrationRouter from "./lib/integration.route.js";
import { WorkspaceMiddleware } from "../middlewares/workspace.middleware.js";
import PublicRoute from "../routers/lib/public.route.js"

/**
 * @param {import('express').Application} app
 */

const initRoutes = (app) => {
    app.use("/auth", AuthRouter);
    app.use('/public', PublicRoute)
    app.use("/users", JWTMiddleware, UserRouter);
    app.use("/workspaces", JWTMiddleware, WorkspacesRouter);
    app.use("/linear", JWTMiddleware, IntegrationRouter);


    app.get("/", async (req, res) => {
        res.json({
            "message": "Welcome to Userarray Developers Portal"
        })
    })

    app.use("*", (req, res) => {
        res.status(404).json({
            "status": 404,
            "message": "Invalid route"
        })
    })
}

export {
    initRoutes
}
