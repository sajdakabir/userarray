import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import axios, { AxiosError } from "axios";

export const CreateCycle = async (
  body: any,
  token: string,
  slug: string,
  space: string,
) => {
  try {
    await axios.post(USER_WORKSPACE + `/${slug}/spaces/${space}/cycles`, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.response?.data);
    return e.response?.data;
  }
};
