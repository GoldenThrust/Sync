// services/mail.service.js
import { createTransport } from "nodemailer";
import { TemplateEngine } from "../utils/template-engine.js";
import { Dev, hostUrl } from "../utils/constants.js";
import process from "process";
class MailService {
  constructor() {
    this.hostUrl = hostUrl;
    this.appName = "Sync Meet - Video Conferencing";
    this.transporter = createTransport(this.getConfig());
  }

  getConfig() {
    return Dev ? {
      host: '0.0.0.0',
      port: 1025,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    } : {
      service: "Gmail",
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    };
  }

  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${process.env.MAIL_USERNAME}>`,
        ...mailOptions
      });
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendOTP(user, crypto) {
    const verificationLink = `${this.hostUrl}/api/auth/activate/${crypto}/${user.otp}?mail=true`;
    
    const html = await TemplateEngine.render('otp-email', {
      appName: this.appName,
      user,
      verificationLink
    });

    return this.sendEmail({
      to: user.email,
      subject: "Verify Your Email Address",
      text: `Please use this OTP to verify your email: ${user.otp}\nOr visit: ${verificationLink}`,
      html
    });
  }

  async sendResetPassword(user, crypto) {
    const resetLink = `${this.hostUrl}/api/auth/reset-password/${crypto}/`;
    
    const html = await TemplateEngine.render('reset-password', {
      appName: this.appName,
      user,
      resetLink
    });

    return this.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click to reset your password: ${resetLink}`,
      html
    });
  }

  async sendInstantMeetingInvite(meeting, user) {
    const meetingLink = `${this.hostUrl}/meet/waiting-room/${meeting.sessionId}`;
    const inviterName = meeting.createdBy.fullname;
    const inviteeName = user.fullname;
    
    const html = await TemplateEngine.render('instant-meeting-invite', {
      appName: this.appName,
      inviterName,
      inviteeName,
      meetingLink
    });

    return this.sendEmail({
      to: user.email,
      subject: `Meeting Invitation: ${meeting.title}`,
      text: `You have been invited to a meeting: ${meeting.title}\nJoin here: ${meetingLink}`,
      html
    });
  }
  async sendGuestInstantMeetingInvite(meeting, email) {
    const meetingLink = `${this.hostUrl}/auth/signup?redirect=${this.hostUrl}/meet/waiting-room/${meeting.sessionId}&email=${email}`;
    const inviterName = meeting.createdBy.fullname;
    // TODO: make it redirect to login page if not logged in with meeting link
    
    const html = await TemplateEngine.render('instant-guest-meeting-invite', {
      appName: this.appName,
      inviterName,
      meetingLink
    });

    return this.sendEmail({
      to: email,
      subject: `Meeting Invitation: ${meeting.title}`,
      text: `You have been invited to a meeting: ${meeting.title}\nJoin here: ${meetingLink}`,
      html
    });
  }
}

const mailService = new MailService();
export default mailService;