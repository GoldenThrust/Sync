import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "https";
import "dotenv/config";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { mongoDB, redisDB } from "./config/db.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { Server } from "socket.io";
import websocket from "./config/websocket.js";
import { getIPAddress } from "./utils/functions.js";
import authRoutes from "./routes/auth.js";
import { authOptionalMiddleware } from "./middlewares/authOptionalMiddleware.js";
import meetRoutes from "./routes/meet.js";
import settingsRoutes from "./routes/settings.js";
import { certOptions } from "./utils/cert.js";
// import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 443;
const dev = process.env.NODE_ENV !== 'production';
const allowUrl = [`http://localhost:5173`, `http://${getIPAddress()}:5173`, `https://${getIPAddress()}:${PORT}`, 'https://localhost:3000'];

// const app = next({ dev })
// const handle = app.getRequestHandler();
// app.prepare().then(() => {
const expressApp = express();

const optionalAuthRoutes = [
  /^\/$/,
  /^\/assets\//,
  /^\/auth\/(?!verify|update-profile|logout).*$/,
  /^\/api\/auth\/(?!verify|update-profile).*$/,
];
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cookieParser(process.env.COOKIE_SECRET));
expressApp.use(cors({ origin: allowUrl, credentials: true }));

expressApp.use(authOptionalMiddleware(optionalAuthRoutes))
expressApp.use('/api/auth', authRoutes);
expressApp.use('/api/lobby', meetRoutes);
expressApp.use('/api/settings', settingsRoutes);

expressApp.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// expressApp.all(/(.*)/, (req, res) => {
//   return handle(req, res);
// });
// expressApp.all('/{*splat}', (req, res) => {
//   return handle(req, res);
// });

// Create HTTP server with Express app
const server = createServer(
  // (req, res) => {
  // console.log(`Request URL: ${req.url}`);
  // const parsedUrl = parse(req.url, true)
  // handle(req, res, parsedUrl)
  // }, 
  certOptions, expressApp);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}  https://${getIPAddress()}:${PORT}`);

  mongoDB.run().catch(console.dir)
  redisDB.run().catch(console.dir)

  // Initialize Socket.IO with the HTTP server
  const io = new Server(server, {
    adapter: createAdapter(redisDB.client),
    cors: {
      origin: allowUrl,
      credentials: true
    },
  });

  websocket.getConnection(io);
});
// });
