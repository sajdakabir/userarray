export type LoginResponse = {
  statusCode: number;
  response: {
    accessToken: string;
    refreshToken: string;
  };
};
