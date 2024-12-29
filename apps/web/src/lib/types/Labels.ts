export type Label = {
  _id: string;
  name: string;
  color: string;
  counter: number;
  space: string;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CreateLabels = {
  status: number;
  response: Label;
};

export type AllLabels = {
  status: number;
  response: Label[];
};
