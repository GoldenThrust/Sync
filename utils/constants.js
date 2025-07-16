import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import process from "process";
import { URL } from "url";
import "dotenv/config"

export const COOKIE_NAME = "auth_token";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const Dev = process.env.NODE_ENV === "development" ? true : false;

export const hostUrl = process.env.VITE_SERVER_URL;
export const upload = multer({ dest: './uploads'});
export const domain = (new URL(hostUrl)).hostname
