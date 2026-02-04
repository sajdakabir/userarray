/**
 * The max age of the cookie in seconds
 */
export const MAX_AGE = 60 * 60 * 24 * 29; // 29 Days

/**
 * The name of the cookie
 */
export const COOKIE_NAME = "userarray";
export const LINEAR_TOKEN='linearToken';
/**
 * The name of the access token cookie
 */
// file deepcode ignore HardcodedNonCryptoSecret: It's a cookie name not a secret
export const ACCESS_TOKEN = "userarrayAccess";

/**
 * The name of the refresh token cookie
 */
export const REFRESH_TOKEN = "userarrayRefresh";

//common login endpoint
export const COMMON_LOGIN = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9001'}/auth/login`

//common signup endpoint
export const COMMON_SIGNUP = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9001'}/auth/signup`

//magic login end point 
export const MAGIC_LOGIN = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9001'}/auth/magic/login`


