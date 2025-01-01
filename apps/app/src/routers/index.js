import AuthRouter from "./core/auth.route.js";
import { JWTMiddleware } from "../middlewares/jwt.middleware.js";
import WorkspacesRouter from "./lib/workspace.route.js";
import UserRouter from "./core/user.route..js";
import LinearRouter from "./lib/linear.route.js";
// import moment from "moment-timezone";
// import { Cycle } from "../models/lib/cycle.model.js";
/**
 * @param {import('express').Application} app
 */

const initRoutes = (app) => {
    app.use("/auth", AuthRouter);
    app.use("/users", JWTMiddleware, UserRouter);
    app.use("/workspaces", JWTMiddleware, WorkspacesRouter);
    app.use("/linear", JWTMiddleware, LinearRouter);
    app.get("/", async (req, res) => {
        res.json({
            "message": "Welcome to March Developers Portal"
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
