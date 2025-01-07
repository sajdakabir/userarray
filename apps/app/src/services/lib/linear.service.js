import axios from "axios";

import { environment } from "../../loaders/environment.loader.js";
import { findTeamByLinearId } from "./team.service.js";
import { Issue } from "../../models/lib/issue.model.js";
import { Workspace } from "../../models/lib/workspace.model.js";

export const getAccessToken = async (code, workspace) => {
    try {
        const requestBody = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: environment.LINEAR_REDIRECT_URL,
            client_id: environment.LINEAR_CLIENT_ID,
            client_secret: environment.LINEAR_CLIENT_SECRET
        };

        const tokenResponse = await axios.post('https://api.linear.app/oauth/token', requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });


        const accessToken = tokenResponse.data.access_token;

        workspace.integration.linear.accessToken = accessToken;
        workspace.integration.linear.connected = true;
        await workspace.save();


        return accessToken;
    } catch (error) {
        console.error('Error fetching Linear token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getLinearTeams = async (accessToken) => {
    try {
        const response = await axios.post(
            'https://api.linear.app/graphql',
            {
                query: `
                    query {
                        teams {
                            nodes {
                                id
                                name
                                description
                                key
                            }
                        }
                    }
                `,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.data.teams.nodes;
    } catch (error) {
        console.error('Error fetching Linear teams:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const fetchTeamIssues = async (linearToken, linearTeamId) => {
    console.log("fetching issues")  
    console.log(linearToken, linearTeamId)
    const response = await axios.post(
        'https://api.linear.app/graphql',
        {
            query: `
            query {
                issues(filter: { 
                    and: [
                        { team: { id: { eq: "${linearTeamId}" } } },
                        { state: { name: { neq: "Done" } } },
                        { state: { name: { neq: "Canceled" } } }
                    ]
                }) {
                    nodes {
                        id
                        title
                        description
                        number
                        state {
                            id
                            name
                        }
                        labels {
                            nodes {
                                id
                                name
                            }
                        }
                        cycle {
                            id
                            name
                            startsAt
                            endsAt
                        }
                        dueDate
                        createdAt
                        updatedAt
                        priority
                        project {
                            id
                            name
                        }
                        assignee {
                            id
                            name
                        }
                        url
                    }
                }
            }
        `
        },
        {
            headers: {
                Authorization: `Bearer ${linearToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.data.errors) {
        console.error("Error fetching issues:", response.data.errors);
        throw new Error("Failed to fetch issues.");
    }

    const issues = response.data.data.issues.nodes;
    return issues;
};

export const saveIssuesToDatabase = async (issues, linearTeamId) => {
    try {
        const team = await findTeamByLinearId(linearTeamId);
        if (!team) {
            throw new Error("Team not found");
        }
        const teamId = team._id;
        const workspaceId = team.workspace;

        for (const issue of issues) {
            const {
                id,
                title,
                description,
                number,
                state,
                labels,
                dueDate,
                createdAt,
                updatedAt,
                priority,
                project,
                assignee,
                url,
                cycle
            } = issue;

            const existingIssue = await Issue.findOne({ linearId: id, team: teamId, workspace: workspaceId });

            if (existingIssue) {
                // Update existing issue
                existingIssue.title = title;
                existingIssue.description = description;
                existingIssue.number = number;
                existingIssue.state = state;
                existingIssue.labels = labels.nodes;
                existingIssue.dueDate = dueDate;
                existingIssue.updatedAt = updatedAt;
                existingIssue.priority = priority;
                existingIssue.project = project;
                existingIssue.assignee = assignee;
                existingIssue.url = url;
                existingIssue.linearTeamId = linearTeamId;
                existingIssue.cycle = cycle;
      
                await existingIssue.save();
              } else {
                // Create a new issue
                const newIssue = new Issue({
                  linearId: id,
                  source: "linear",
                  title,
                  description,
                  number,
                  state,
                  labels: labels.nodes,
                  dueDate,
                  createdAt,
                  updatedAt,
                  priority,
                  cycle,
                  project,
                  assignee,
                  url,
                  linearTeamId,
                  team: teamId,
                  workspace: workspaceId,
                });

                await newIssue.save();
              }
            }
        
            console.log('Issues saved/updated successfully');
        
    } catch (error) {
        console.error('Error saving issues to database:', error);
        throw error;
    }
};

export const fetchCurrentCycle = async (linearToken, teamId) => {
    const response = await axios.post(
        'https://api.linear.app/graphql',
        {
            query: `
            query GetCyclesForTeam($teamId: String!) {
                team(id: $teamId) {
                    cycles {
                        nodes {
                            id
                            name
                            startsAt
                            endsAt
                            completedAt
                        }
                    }
                }
            }
            `,
            variables: {
                teamId,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${linearToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.data.errors) {
        console.error("Error fetching cycles:", response.data.errors);
        throw new Error("Failed to fetch cycles.");
    }

    const cycles = response.data.data.team.cycles.nodes;

    const now = new Date();
    const currentCycle = cycles.find((cycle) => {
        const startsAt = new Date(cycle.startsAt);
        const endsAt = new Date(cycle.endsAt);

        return (
            cycle.completedAt === null && 
            now >= startsAt &&            
            now <= endsAt               
        );
    });

    return currentCycle || null;
};

// export const handleLinearWebhookEvent = async (payload) => {
//     const issue = payload.data;
//     let message = "";
//     let action = null;
//     let broadcastItem = null;
//     let targetWorkspaceId = null;


//     if (payload.action === "remove") {
//         const deletedIssue = await Issue.findOneAndDelete({ linearId: issue.id, linearTeamId: issue.team.id });
//         if (deletedIssue) {
//             message = `Deleted issue with ID: ${issue.id}`;
//             action = "delete";
//             broadcastItem = deletedIssue;
//             targetWorkspaceId = deletedIssue.workspace;
//         } else {
//             console.log(`Issue with ID: ${issue.id} not found in the database.`);
//         }
//     } else {
//         if (!issue.team || !issue.team.id) {
//             const deletedIssue = await Issue.findOneAndDelete({ linearId: issue.id, linearTeamId: issue.team.id });
//             if (deletedIssue) {
//                 message = `Unassigned issue with ID: ${issue.id} deleted from the database.`;
//                 action = "unassigned";
//                 broadcastItem = deletedIssue;
//                 targetWorkspaceId = deletedIssue.workspace;
//             } else {
//                 console.log(`Unassigned issue with ID: ${issue.id} not found in the database.`);
//             }
//         } else {
//             const workspace = await Workspace.findOne({ "integration.linear.teamId": issue.team.id });
//             if (!workspace) {
//                 console.log("No workspace found with the matching Linear teamId.");
//                 return;
//             }
//             const workspaceId = workspace._id;
//             const teamId = workspace?.linear?.teamId;
//             targetWorkspaceId = workspaceId;

//             const existingIssue = await Issue.findOne({ linearId: issue.id, linearTeamId: issue.team.id, workspace: workspaceId });
//             if (existingIssue) {
//                 const dueDate = issue.dueDate ? issue.dueDate : null;
//                 const startsAt = issue.cycle?.startsAt ? issue.cycle?.startsAt : null;
//                 const endsAt = issue.cycle?.endsAt ? issue.cycle?.endsAt : null;
//                 const updatedIssue = await Item.findByIdAndUpdate(existingIssue._id, {
//                     title: issue.title,
//                     description: issue.description,
//                     number: issue.number,
//                     state: {
//                         id: issue.state.id,
//                         name: issue.state.name,
//                         color: issue.state.color
//                     },
//                     dueDate,
//                     "cycle.startsAt": startsAt,
//                     "cycle.endsAt": endsAt,
//                     "cycle.name": issue.cycle.name,
//                     updatedAt: issue.updatedAt,
//                     priority: issue.priority,
//                     project: issue.project,
//                     assignee: issue.assignee,
//                     url: issue.url,
//                     linearTeamId: issue.team.id,
//                 }, { new: true });

//                 message = `Updated issue with ID: ${issue.id}`;
//                 action = "update"
//                 broadcastItem = updatedIssue;
//             } else {
//                 const newIssue = new Issue({
//                     title: issue.title,
//                     description: issue.description,
//                     number: issue.number,
//                     state: {
//                         id: issue.state.id,
//                         name: issue.state.name,
//                         color: issue.state.color
//                     },
//                     dueDate: issue.dueDate,
//                     createdAt: issue.createdAt,
//                     updatedAt: issue.updatedAt,
//                     priority: issue.priority,
//                     project: issue.project,
//                     assignee: issue.assignee,
//                     url: issue.url,
//                     linearTeamId: issue.team.id,
//                     cycle: issue.cycle, 
//                     team: workspace?.teamId,
//                     workspace: workspaceId
//                 });
//                 const savedIssue = await newIssue.save();
//                 message = `Created new issue with ID: ${issue.id}`;
//                 action = "create"
//                 broadcastItem = savedIssue;
//             }
//         }
//     }

//     if (targetWorkspaceId) {
//         const broadcastData = {
//             type: "linear",
//             message,
//             action,
//             item: broadcastItem
//         };

//         // broadcastToUser(targetUserId.toString(), broadcastData, true);
//     }
// };

export const handleLinearWebhookEvent = async (payload) => {
    const issue = payload.data;
    let message = "";
    let action = null;
    let broadcastItem = null;
    let targetWorkspaceId = null;
    try {
        console.log("Processing issue for team ID:", issue.teamId);

        if (payload.action === "remove") {
            // Handle issue removal
            const deletedIssue = await Issue.findOneAndDelete({ linearId: issue.id, linearTeamId: issue.teamId });
            if (deletedIssue) {
                message = `Deleted issue with ID: ${issue.id}`;
                action = "delete";
                broadcastItem = deletedIssue;
                targetWorkspaceId = deletedIssue.workspace;
            } else {
                console.warn(`Issue with ID: ${issue.id} not found in the database for deletion.`);
            }
        } else {

                const workspace = await Workspace.findOne({ "integration.linear.teamId": issue.teamId});
                if (!workspace) {
                    console.error("No workspace found with the matching Linear teamId:", issue.teamId);
                    return;
                }

                targetWorkspaceId = workspace._id;

                // Check if the issue already exists
                const existingIssue = await Issue.findOne({ linearId: issue.id, linearTeamId: issue.teamId, workspace: targetWorkspaceId, source: "linear" });
                if (existingIssue) {
                    // Update existing issue
                    const updatedIssue = await Issue.findByIdAndUpdate(
                        existingIssue._id,
                        {
                            title: issue.title,
                            description: issue.description,
                            number: issue.number,
                            state: {
                                id: issue.state.id,
                                name: issue.state.name,
                                color: issue.state.color,
                            },
                            dueDate: issue.dueDate || null,
                            "cycle.startsAt": issue.cycle?.startsAt || null,
                            "cycle.endsAt": issue.cycle?.endsAt || null,
                            "cycle.name": issue.cycle?.name || null,
                            updatedAt: issue.updatedAt,
                            priority: issue.priority,
                            project: issue.project,
                            assignee: issue.assignee,
                            url: issue.url,
                            linearTeamId: issue.team.id,
                        },
                        { new: true }
                    );

                    message = `Updated issue with ID: ${issue.id}`;
                    action = "update";
                    broadcastItem = updatedIssue;
                } else {
                    // Create a new issue
                    const newIssue = new Issue({
                        linearId: issue.id,
                        source: "linear",
                        title: issue.title,
                        description: issue.description,
                        number: issue.number,
                        state: {
                            id: issue.state.id,
                            name: issue.state.name,
                            color: issue.state.color,
                        },
                        dueDate: issue.dueDate,
                        createdAt: issue.createdAt,
                        updatedAt: issue.updatedAt,
                        priority: issue.priority,
                        project: issue.project,
                        assignee: issue.assignee,
                        url: issue.url,
                        linearTeamId: issue.team.id,
                        cycle: issue.cycle,
                        team: workspace.teamId,
                        workspace: targetWorkspaceId,
                    });

                    const savedIssue = await newIssue.save();
                    message = `Created new issue with ID: ${issue.id}`;
                    action = "create";
                    broadcastItem = savedIssue;
                }
        }

        // Broadcast the event if a workspace ID is identified
        if (targetWorkspaceId) {
            const broadcastData = {
                type: "linear",
                message,
                action,
                item: broadcastItem,
            };

            // broadcastToUser(targetWorkspaceId.toString(), broadcastData, true);
        }
    } catch (error) {
        console.error("Error handling Linear webhook event:", error.message);
    }
};

