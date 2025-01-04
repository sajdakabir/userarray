import { Team } from "../../models/lib/team.model.js";

const createSpace = async (teamData, workspace) => {
    const team = await Team.create(teamData);
    if (!team) {
        const error = new Error("Failed to create the team");
        error.statusCode = 500;
        throw error;
    }
    workspace.teams.push(team._id);
    await workspace.save();
    return team;
};

export { createSpace };
