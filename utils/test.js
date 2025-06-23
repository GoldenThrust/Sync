import { TemplateEngine } from "./template-engine.js";

const mail = await TemplateEngine.render('instant-meeting-invite', {
  inviterName: 'John Doe',
  inviteeName: 'John Doe',
  meetingLink: `https://yourapp.com/meeting/12345`
});

console.log("Meeting invite email template rendered successfully.");
console.log(mail);