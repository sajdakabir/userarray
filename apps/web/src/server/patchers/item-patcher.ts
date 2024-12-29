import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { SingleItem } from "@/lib/types/Items";
import axios, { AxiosError } from "axios";

export const patchItem = async (
  body: any,
  slug: string,
  space: string,
  uuid: string,
  token: string
) => {
  try {
    const patchResponse = await axios.patch(
      USER_WORKSPACE + `/${slug}/spaces/${space}/items/${uuid}`,
      body,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const newItem: SingleItem = patchResponse.data;
    return newItem.response;
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.response?.data);
    return null;
  }
};
