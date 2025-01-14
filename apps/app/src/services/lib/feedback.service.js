import axios from 'axios';
import { Issue } from "../../models/lib/issue.model.js";

const LINEAR_API_URL = 'https://api.linear.app/graphql';

export const createFeedback = async (requestedData, user, workspace) => {
    const linearTeamId = workspace.integration.linear.teamId;     
    const linearAccessToken = workspace.integration.linear.accessToken;

    // Create a new issue in database
    const newIssue = new Issue({
        ...requestedData,
        source: "feedback",
        createdBy: user.id,
        workspace: workspace._id,
        team: workspace.teams[0]._id,
    });
    const issue = await newIssue.save();

    // Send the feedback to the Linear team triage
    const linearIssueData = {
        teamId: linearTeamId,
        title: requestedData.title,
        description: requestedData.description,
    };

    try {
        const response = await axios.post(LINEAR_API_URL, {
            query: `
                mutation CreateIssue($input: IssueCreateInput!) {
                    issueCreate(input: $input) {
                        success
                        issue {
                            id
                            title
                        }
                    }
                }
            `,
            variables: {
                input: linearIssueData,
            },
        }, {
            headers: {
                'Authorization': `Bearer ${linearAccessToken}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error sending feedback to Linear team triage:', error.response.data);
    }

    return issue;
}

export const getAllFeedback = async (workspace, team) => {
    const issues = await Issue.find({
        workspace: workspace._id,
        team: team,
        source: "feedback"
    });
    return issues;
}