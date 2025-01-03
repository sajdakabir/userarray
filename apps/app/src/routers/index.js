import AuthRouter from "./core/auth.route.js";
import { JWTMiddleware } from "../middlewares/jwt.middleware.js";
import WorkspacesRouter from "./lib/workspace.route.js";
import UserRouter from "./core/user.route..js";
import IntegrationRouter from "./lib/integration.route.js";
import { WorkspaceMiddleware } from "../middlewares/workspace.middleware.js";

/**
 * @param {import('express').Application} app
 */

const initRoutes = (app) => {
    app.use("/auth", AuthRouter);
    app.use("/users", JWTMiddleware, UserRouter);
    app.use("/workspaces", JWTMiddleware, WorkspacesRouter);
    app.use("/linear", JWTMiddleware, WorkspaceMiddleware, IntegrationRouter);

    // app.get("/test", async (req, res) => {
    //     const today = moment.utc().startOf('day');
    //     const previousDay = moment(today).subtract(1, 'day').startOf('day');
    //     const cyclesEndingToday = await Cycle.find({
    //         endDate: {
    //             $lt: today.toDate(), // End date is before today
    //             $gte: previousDay.toDate() // End date is on or after the previous day
    //         }
    //     });
    //     res.json(
    //         cyclesEndingToday
    //     )
    // })

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
