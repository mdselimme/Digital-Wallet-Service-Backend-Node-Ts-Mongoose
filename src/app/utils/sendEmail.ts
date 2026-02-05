/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envData } from "../config/envVariable";
import path from "path";
import ejs from "ejs";
import { AppError } from "./AppError";

const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envData.SMTP.SMTP_USER,
        pass: envData.SMTP.SMTP_PASS
    },
    port: Number(envData.SMTP.SMTP_PORT),
    host: envData.SMTP.SMTP_HOST,
});

interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}


export const sendEmail = async ({ to,
    subject,
    attachments,
    templateName, templateData }: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envData.SMTP.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });
        console.log(`\u2709\uFE0F Email send to ${to}: ${info.messageId}`)
    } catch (error: any) {
        console.log('Email sending error: ', error.message);
        throw new AppError(401, "Email sending error.")
    }
}