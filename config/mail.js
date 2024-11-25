import { createTransport } from "nodemailer";
import { hostUrl } from "../utils/constants.js";
import process from "process";

class MailService {
    constructor() {
        this.hostUrl = hostUrl;
        // this.transporter = createTransport({
        //     service: "Gmail",
        //     host: process.env.MAIL_HOST,
        //     port: process.env.MAIL_PORT,
        //     secure: true,
        //     auth: {
        //         user: process.env.MAIL_USERNAME,
        //         pass: process.env.MAIL_PASSWORD,
        //     },
        // });

        this.transporter = createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendOTP(user, crypto) {
        const verificationLink = `${this.hostUrl}/activate-account/${crypto}/${user.otp}?mail=true`;

        const mailTemplate = `
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="text-align: center; color: #333;">Welcome to Sync!</h1>
            <h2 style="color: #555;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: #555;">
            Hello ${user.name || 'User'},<br><br>
            Thank you for signing up for Sync! Please confirm your email address to complete your registration.
            </p>
           <div style="margin: 20px 0; font-size: 18px; font-weight: bold;">
                <p>Please verify your account using the following OTP:</p>
                <h2 style="color: #e74c3c;">${user.otp}</h2>
            </div>

         
            <div style="margin: 20px 0; font-size: 16px; font-style: italic;">
                <p>Alternatively, you can activate your account by clicking the link below:</p>
                <a href="${verificationLink}" style="color: #3498db; font-weight: bold; text-decoration: none;">Activate Account</a>
            </div>
        <p style="font-size: 14px; color: #999; text-align: center;">
          This link will expire in 24 hours. If you didn’t request this, please ignore this email.
        </p>
      </div>
    </body>`;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: "Email Verification",
            text: `Please verify your email by clicking the following link: ${verificationLink}`,
            html: mailTemplate
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    async sendResetPasswordEmail(user, crypto) {
        const resetPasswordLink = `${this.hostUrl}/reset-password/${crypto}/`;

        const mailTemplate = `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
      <h1 style="text-align: center; color: #333;">Reset Your Password</h1>
      <h2 style="color: #555;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">
        Hello ${user.name || 'User'},<br><br>
        We received a request to reset your password. Click the button below to reset your password.
      </p>
      <p style="text-align: center;">
        <a href="${resetPasswordLink}" style="background-color: #ff6f61; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 14px; color: #999; text-align: center;">
        This link will expire in 1 hour. If you didn’t request this, please ignore this email.
      </p>
    </div>
  </body>`;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: "Sync: Reset Password",
            text: `Please reset your password by clicking the following link: ${resetPasswordLink}`,
            html: mailTemplate
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}

const mail = new MailService();
export default mail;
