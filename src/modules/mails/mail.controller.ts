import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class MailController {

    constructor() { }

    async sendMail(req: Request, res: Response) {
        const { from, to, subject, text } = req.body;

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST!,
                port: parseInt(process.env.MAIL_PORT!),
                secure: true,
                auth: {
                    user: process.env.MAIL_USER!,
                    pass: process.env.MAIL_USER_PASSWORD!,
                },
            });

            const mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: text,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Email sent successfully", "status": 200 });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Error sending email", "status": 400 });
        }
    }
}

