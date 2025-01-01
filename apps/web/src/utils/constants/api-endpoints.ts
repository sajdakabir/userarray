/**
 * The base url of the backend
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

/**
 * The Url to login with magic link
 */
export const MAGIC_LOGIN = `${BACKEND_URL}/auth/magic/login`;

/**
 * The Url to login with common link
 */
export const COMMON_LOGIN = `${BACKEND_URL}/auth/common/login`;

/**
 * The Url to verify the magic link
 */
export const MAGIC_VERIFY = `${BACKEND_URL}/auth/magic/verify`;

/**
 * The Url to get the user info
 */
export const GET_USER = `${BACKEND_URL}/users/me`;

/**
 * The base Url to work with workspaces
 */
export const USER_WORKSPACE = `${BACKEND_URL}/workspaces`;
