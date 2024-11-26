import { Router } from "express";
import settingsController from "../controllers/settingsController.js";
import { settingsValidator, validate } from "../middlewares/validators.js";

const settingsRoutes = Router();

settingsRoutes.post('/initiate', validate(settingsValidator), settingsController.initiate);
settingsRoutes.put('/update', settingsController.update);
settingsRoutes.get('/get', settingsController.getSettings);

export default settingsRoutes;