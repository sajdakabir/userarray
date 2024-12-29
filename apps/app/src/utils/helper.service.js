import { hash, compare } from "bcrypt";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import mailer from "../loaders/email.loader.js";
import generate from "generate-password";

const generateHash = async (text, saltRounds = 12) => {
    return hash(text, saltRounds);
};

const verifyPasswordHash = async (text, encrypted) => {
    return compare(text, encrypted);
};

const readTemplateFile = async (name, data) => {
    const content = fs
        .readFileSync(path.resolve("src", "templates", `${name}.hbs`))
        .toString("utf8");
    const template = handlebars.compile(content, {
        noEscape: true
    });
    return template(data);
};

const generateRandomPassword = (length = 10) =>
    generate.generate({
        length,
        symbols: true,
        numbers: true
    });

const sendEmail = async ({ from, to, replyTo, cc, content, subject }) => {
    const response = await mailer.sendMail({
        from,
        to,
        replyTo,
        cc,
        html: content,
        subject
    });
    return response;
};

export {
    generateHash,
    verifyPasswordHash,
    readTemplateFile,
    sendEmail,
    generateRandomPassword
};
