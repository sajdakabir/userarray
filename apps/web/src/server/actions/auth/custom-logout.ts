"use server";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "@/config/constant/cookie";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const CustomLogout = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    // Call backend logout endpoint if token exists
    if (accessToken) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Backend logout failed:", error);
        // Continue with local logout even if backend fails
      }
    }

    // Clear auth cookies
    cookieStore.delete(ACCESS_TOKEN);
    cookieStore.delete(REFRESH_TOKEN);

    // Revalidate the home and auth pages to clear cache
    revalidatePath("/");
    revalidatePath("/auth");
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;
    // Check if it's a redirect error (expected behavior)
    if (e.message === "NEXT_REDIRECT" || e.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // Re-throw to allow redirect
    }
    console.error("Logout error:", e.message);
    throw new Error("Failed to logout");
  }
  
  // Redirect to login page (must be outside try-catch)
  redirect("/");
};

export default CustomLogout;
