export interface FeedbackActivity {
    type: string;
    action: string;
    timestamp?: string;
    user: string;
    from?: string;
    to?: string;
}

export interface FeedbackStatus {
    name: string;
    color?: string;
}

export interface Feedback {
    state: FeedbackStatus;
    _id?: string;
    source: string;
    title: string;
    description: string;
    team: string;
    workspace: string;
    createdBy: string;
    isArchived: boolean;
    isDeleted: boolean;
    uuid: string;
    labels: [];
    createdAt?: string;
    updatedAt?: string;
    type?: string;
    like: null | number;
    comments: string | null;
    comment: null | string;
    activity?: FeedbackActivity[];
}
