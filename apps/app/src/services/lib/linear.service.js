import axios from "axios";

import { environment } from "../../loaders/environment.loader.js";
import { findTeamByLinearId } from "./team.service.js";
import { Issue } from "../../models/lib/issue.model.js";

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
        console.log("AccessToken:", accessToken);
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

        // Extract teams from the response
        return response.data.data.teams.nodes;
    } catch (error) {
        console.error('Error fetching Linear teams:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const fetchTeamIssues = async (linearToken, linearTeamId) => {
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

    return response.data.data.team.cycles.nodes;
};


