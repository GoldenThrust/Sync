import process from "process";
import Session from "../models/session.js";
import mailService from "../config/mail.js";
import User from "../models/user.js";
import { v7 as uuid } from 'uuid';

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

    async scheduleMeeting(req, res) {
        try {
            const { title, date, privacy, time, invite } = req.body;
            
            if (!title || !date) {
                return res.status(400).json({ status: "ERROR", response: "Meeting title and date are required" });
            }

            // Generate a unique sessionId
            const sessionId = uuid();
            
            // Calculate meeting duration in milliseconds
            let duration = 3600000; // Default 1 hour
            if (time) {
                const [hours, minutes] = time.split(':').map(Number);
                duration = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
            }

            // Create the meeting session
            const session = new Session({
                sessionId,
                title,
                activeDate: new Date(date),
                duration,
                visibility: privacy?.toLowerCase() === 'private' ? 'private' : 'public',
                createdBy: req.user,
                activeUsers: [req.user._id]
            });

            await session.save();

            // Process invited participants if any
            if (invite) {
                const emailList = invite.split(',').map(email => email.trim()).filter(email => email);

                for (const email of emailList) {
                    const user = await User.findOne({ email });
                    if (user) {
                        session.invitedUsers.push(user);
                        await mailService.sendScheduledMeetingInvite(session, user);
                    } else {
                        session.invitedGuestUsers.push(email);
                        await mailService.sendScheduledGuestMeetingInvite(session, email);
                    }
                }
                await session.save();
            }

            res.json({ 
                status: "OK", 
                response: "Meeting scheduled successfully",
                meeting: {
                    id: sessionId,
                    title,
                    date: new Date(date),
                    duration,
                    visibility: privacy?.toLowerCase() === 'private' ? 'private' : 'public'
                }
            });
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

    async getScheduledMeetings(req, res) {
        try {
            // Find all sessions where the current user is either the creator or an invited participant
            // and where the meeting date is in the future
            const currentDate = new Date();
            
            const sessions = await Session.find({
                $or: [
                    { createdBy: req.user._id },
                    { invitedUsers: req.user._id }
                ],
                activeDate: { $gte: currentDate }
            })
            .sort({ activeDate: 1 }) // Sort by date, earliest first
            .populate('createdBy', 'fullname email')
            .populate('invitedUsers', 'fullname email');

            res.json({ status: "OK", meetings: sessions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "ERROR", response: "Internal server error", error: error.message });
        }
    }
}
const meetController = new MeetController();
export default meetController;