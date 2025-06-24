import process from "process";
import Session from "../models/session.js";
import mailService from "../config/mail.js";
import User from "../models/user.js";

class MeetController {
    async initiate(req, res) {
        const id = req.params.id;

        let session = await Session.findOne({ sessionId: id });
        if (!session) {
            session = new Session({ sessionId: id, createdBy: req.user, activeUsers: [req.user._id] });
        }
        await session.save();
        return res.redirect(`${process.env.CLIENT_URL}/room/` + id)
    }

    async sendInstantMeetingInvite(req, res) {
        try {
            const { emails, sessionId } = req.body;

            if (!emails || !sessionId) {
                return res.status(400).json({ status: "ERROR", response: "Emails and sessionId are required" });
            }

            let session = await Session.findOne({ sessionId });
            if (!session) {
                session = new Session({ sessionId, createdBy: req.user, activeUsers: [req.user._id] });
            }
            await session.save();

            const emailList = emails.split(',').map(email => email.trim()).filter(email => email);

            for (const email of emailList) {
                const user = await User.findOne({ email });
                if (!user) {
                    const alreadyActive = session.invitedGuestUsers.find(e => e === email);
                    if (!alreadyActive) {
                        await mailService.sendGuestInstantMeetingInvite(session, email);
                    }
                } else {
                    const alreadyActive = session.activeUsers.find(u => u._id.toString() === user._id.toString());
                    const invitedUser = session.invitedUsers.find(u => u._id.toString() === user._id.toString());
                    if (!alreadyActive && !invitedUser) {
                        session.invitedUsers.push(user);
                        // await session.invitedUsers.save();

                        await mailService.sendInstantMeetingInvite(session, user);
                    }
                }
                await session.save();
            }

            res.json({ status: "OK", response: "Invite sent successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "ERROR", response: "Internal server error", error: error.message });
        }
    }

    async getActiveUsers(req, res) {
        try {
            const id = req.params.id;

            const session = await Session.findOne({
                sessionId: id
            });


            if (!session) {
                return res.status(404).json({ status: "OK", response: "Session not found" });
            }

            const response = session.activeUsers.filter(
                (userObj) => userObj.user.email !== req.user.email
            );

            res.json({ status: "OK", response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "ERROR", response: "Internal server error", error: error.message });
        }
    }
}
const meetController = new MeetController();
export default meetController;