import { getTeamCurrentCycles } from "../../services/lib/cycle.service.js";


export const getTeamCurrentCyclesController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const cycles = await getTeamCurrentCycles(workspace._id, workspace.teams[0]._id);
        res.json({
            status: 200,
            response: cycles
        });
    } catch (err) {
        next(err);
    }
}
