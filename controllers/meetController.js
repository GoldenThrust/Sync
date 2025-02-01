import process from "process";
import Session from "../models/session.js";

class MeetController {
    async initiate(req, res) {
        const id = req.params.id;

        const session = await Session.findOne({ sessionId: id });
        if (!session) {
            const session = new Session({ sessionId: id });
            await session.save();
        }
        return res.redirect(`${process.env.DEV_URL}/meet/room/` + id)
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