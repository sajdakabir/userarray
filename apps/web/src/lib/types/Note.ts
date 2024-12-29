export type Note = {
  _id: string;
  uuid: string;
  date: string;
  user: string;
  workspace: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type SingleNote = {
  status: number;
  response: Note;
};
