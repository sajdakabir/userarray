/**
 * The base url of the backend
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9001';;

/**
 * The Url to get the user info
 */
export const GET_USER = `${BACKEND_URL}/users/me`;

export const USER_WORKSPACE = `${BACKEND_URL}/workspaces`;
