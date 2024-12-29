import { OAuth2Client } from "google-auth-library";
import { environment } from "./environment.loader.js";
const client = new OAuth2Client(environment.GOOGLE_CLIENT_ID, environment.GOOGLE_CLIENT_SECRET)

export const OauthClient = client;
