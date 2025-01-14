import { config } from "dotenv";

config()

export const environment = {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    MONGO: process.env.MONGO,
    DB_HOST: process.env.DB_HOST,
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT || 9001,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    JWT_EXPIRY: '30d',
    SHOW_ADMIN: process.env.SHOW_ADMIN,
    WEB_HOST: process.env.WEB_HOST,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIS_DB_NAME: process.env.REDIS_HOST,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_DB_USER: process.env.REDIS_DB_USER,
    REDIS_DB_PASS: process.env.REDIS_DB_PASS,
    LINEAR_CLIENT_ID: process.env.LINEAR_CLIENT_ID,
    LINEAR_CLIENT_SECRET: process.env.LINEAR_CLIENT_SECRET,
    LINEAR_REDIRECT_URL: process.env.LINEAR_REDIRECT_URL,
    LINEAR_WH_SECRET: process.env.LINEAR_WH_SECRET,
    NGROK_AUTH_TOKEN: process.env.NGROK_AUTH_TOKEN,
    LINER_WEBHOOK_SECRET: process.env.LINER_WEBHOOK_SECRET,
    LINEAR_API_URL: process.env.LINEAR_API_URL,
}