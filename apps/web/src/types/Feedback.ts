import { UserProfile } from "./Users";

export interface FeedbackStatus {
    name:string
}
export interface labels {
    _id:string,
    id:string,
    name:string,
    color:string
}

export interface Feedback {
    state: FeedbackStatus;
    _id?: string;
    source: string;
    title: string;
    description: string;
    team: string;
    workspace: string;
    createdBy: UserProfile |null;
    isArchived: boolean;
    isDeleted: boolean;
    uuid: string;
    labels: labels[] |[];
    createdAt?: string;
    updatedAt?: string;
    type?: string;
    like: null | number;
    comments:string|null;
    comment: null | string;
   
}
