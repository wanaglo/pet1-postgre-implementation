import userEmailInfoRepository from '../repositories/user-email-info-repository';
import nodemailer from 'nodemailer';
import * as uuid from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, API_URL } = process.env;

class MailService {
    private transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: +SMTP_PORT!,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

    async findEmailInfo(id: number) {
        return await userEmailInfoRepository.findUserInfO(id);
    }

    async findActivationLink(activationLink: string) {
        return await userEmailInfoRepository.findActivationLink(activationLink);
    }

    async activateUser(id: number) {
        await userEmailInfoRepository.activateUser(id);
    }

    async saveEmailInfo(id: number) {
        const activationLink = uuid.v4();

        return await userEmailInfoRepository.createUserInfo(id, activationLink);
    }

    async sendMailActivation(recipient: string, link: string) {
        this.transporter.sendMail({
            from: SMTP_USER,
            to: recipient,
            subject: 'Активация аккаунта на ' + API_URL,
            html: `
                    <div>
                        <h1>Перейдите по ссылке для активации аккаунта</h1>
                        <a href="${link}">${link}</a>
                    <div>
            `,
        });
    }
}

export default new MailService();
