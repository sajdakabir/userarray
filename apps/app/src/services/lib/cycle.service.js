import { Cycle } from "../../models/lib/cycle.model.js";
import { findTeamByLinearId } from "./team.service.js";

export const createLinearCurrentCycle = async (currentCycle, linearTeamId) => {
    const team = await findTeamByLinearId(linearTeamId);
    if (!team) {
        throw new Error("Team not found");
    }
    const teamId = team._id;
    const workspaceId = team.workspace;

    const newCycle = new Cycle({
        ...currentCycle,
        linearTeamId: linearTeamId,
        workspace: workspaceId,
        team: teamId
    });
    await newCycle.save();
    return newCycle;
}

export const getTeamCurrentCycles = async (workspace, team) => {
    const currentDate = new Date();
    const cycle = await Cycle.findOne({
        workspace: workspace,
        team: team,
        isDeleted: false,
        isArchived: false,
        startsAt: { $lte: currentDate },
        endsAt: { $gte: currentDate }
    });
    return cycle;
}
