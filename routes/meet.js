import { Router } from "express";
import meetController from "../controllers/meetController.js";

const meetRoutes = Router();

meetRoutes.get('/initiate/:id', meetController.initiate);
meetRoutes.get('/get-active-users/:id', meetController.getActiveUsers);
meetRoutes.get('/scheduled', meetController.getScheduledMeetings);
meetRoutes.post('/send-instant-invite', meetController.sendInstantMeetingInvite);
meetRoutes.post('/schedule', meetController.scheduleMeeting);
export default meetRoutes;