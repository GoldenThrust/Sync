import { Router } from "express";
import meetController from "../controllers/meetController.js";

const meetRoutes = Router();

meetRoutes.get('/initiate/:id', meetController.initiate);
export default meetRoutes;