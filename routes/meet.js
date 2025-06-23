import { Router } from "express";
import meetController from "../controllers/meetController.js";

const meetRoutes = Router();

meetRoutes.get('/initiate/:id', meetController.initiate);
meetRoutes.get('/get-active-users/:id', meetController.getActiveUsers);
meetRoutes.post('/send-instant-invite', meetController.sendInstantMeetingInvite);
export default meetRoutes;