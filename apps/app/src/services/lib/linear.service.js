import axios from "axios";

import { environment } from "../../loaders/environment.loader.js";

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

