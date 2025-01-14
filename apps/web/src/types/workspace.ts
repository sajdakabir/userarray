export type LinearIntegration = {
    connected: boolean;
    accessToken: string;
    team: string;
    teamId: string;
};
export type Team = {
    _id: string;
    name: string;
    workspace: string;
};


export type Workspace = {
    _id: string;
    name: string;
    slug: string;
    teams: Team[];
    createdBy: string;
    isDeleted: boolean;
    uuid: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    __v: number;
    integration: {
        linear: LinearIntegration;
    };
};
