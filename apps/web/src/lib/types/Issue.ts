export type IssueStatus={
    id: string;
    name: string;
}

export interface Issue {
    state: IssueStatus;
    project: string | null;
    assignee: string | null;
    cycle: string | null;
    _id: string;
    linearId: string;
    source: string;
    title: string;
    description: string;
    number: number;
    labels: string[];
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    priority: number;
    url: string;
    linearTeamId: string;
    team: string;
    workspace: string;
    isArchived: boolean;
    isDeleted: boolean;
    uuid: string;
    __v: number;
}
