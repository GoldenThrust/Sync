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

  async sendOTP(user, token) {
    const resetLink = `${this.hostUrl}/api/auth/activate/${token}/${user.otp}?mail=true`;
    
    const html = await TemplateEngine.render('otp-email', {
      appName: this.appName,
      user,
      resetLink
    });

    return this.sendEmail({
      to: user.email,
      subject: "Verify Your Email Address",
      text: `Please use this OTP to verify your email: ${user.otp}\nOr visit: ${resetLink}`,
      html
    });
  }

  async sendResetPassword(user, token) {
    const resetLink = `${this.hostUrl}/auth/reset-password/${token}/`;
    
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

  async sendScheduledMeetingInvite(meeting, user) {
    const meetingLink = `${this.hostUrl}/meet/waiting-room/${meeting.sessionId}`;
    const inviterName = meeting.createdBy.fullname;
    const inviteeName = user.fullname;
    const logoUrl = `${this.hostUrl}/sync-logo.svg`;
    
    // Format the meeting date
    const meetingDate = new Date(meeting.activeDate);
    const formattedDate = meetingDate.toLocaleString();
    
    // Calculate duration in hours and minutes
    const durationHours = Math.floor(meeting.duration / (60 * 60 * 1000));
    const durationMinutes = Math.floor((meeting.duration % (60 * 60 * 1000)) / (60 * 1000));
    const formattedDuration = `${durationHours > 0 ? durationHours + ' hours' : ''} ${durationMinutes > 0 ? durationMinutes + ' minutes' : ''}`.trim();
    
    const html = await TemplateEngine.render('scheduled-meeting-invite', {
      appName: this.appName,
      logoUrl,
      inviterName,
      inviteeName,
      meetingLink,
      meetingTitle: meeting.title,
      meetingDate: formattedDate,
      meetingDuration: formattedDuration
    });

    return this.sendEmail({
      to: user.email,
      subject: `Scheduled Meeting: ${meeting.title}`,
      text: `You have been invited to a scheduled meeting: ${meeting.title}\nDate: ${formattedDate}\nDuration: ${formattedDuration}\nJoin here: ${meetingLink}`,
      html
    });
  }

  async sendScheduledGuestMeetingInvite(meeting, email) {
    const meetingLink = `${this.hostUrl}/auth/signup?redirect=${this.hostUrl}/meet/waiting-room/${meeting.sessionId}&email=${email}`;
    const inviterName = meeting.createdBy.fullname;
    const logoUrl = `${this.hostUrl}/sync-logo.svg`;
    
    // Format the meeting date
    const meetingDate = new Date(meeting.activeDate);
    const formattedDate = meetingDate.toLocaleString();
    
    // Calculate duration in hours and minutes
    const durationHours = Math.floor(meeting.duration / (60 * 60 * 1000));
    const durationMinutes = Math.floor((meeting.duration % (60 * 60 * 1000)) / (60 * 1000));
    const formattedDuration = `${durationHours > 0 ? durationHours + ' hours' : ''} ${durationMinutes > 0 ? durationMinutes + ' minutes' : ''}`.trim();
    
    const html = await TemplateEngine.render('scheduled-guest-meeting-invite', {
      appName: this.appName,
      logoUrl,
      inviterName,
      meetingLink,
      meetingTitle: meeting.title,
      meetingDate: formattedDate,
      meetingDuration: formattedDuration
    });

    return this.sendEmail({
      to: email,
      subject: `Scheduled Meeting: ${meeting.title}`,
      text: `You have been invited to a scheduled meeting: ${meeting.title}\nDate: ${formattedDate}\nDuration: ${formattedDuration}\nJoin here: ${meetingLink}`,
      html
    });
  }
}

const mailService = new MailService();
export default mailService;