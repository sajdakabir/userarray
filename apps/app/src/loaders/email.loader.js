import nodemailer from "nodemailer";
import SendGridInterceptor from "nodemailer-sendgrid";
import { environment } from "./environment.loader.js";

const mailer = nodemailer.createTransport(SendGridInterceptor({
    apiKey: environment.SENDGRID_API_KEY
}))

export default mailer
