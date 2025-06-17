import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createHttpsServer } from "https";
import { createServer as createHttpServer } from "http";
import "dotenv/config";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { mongoDB, redisDB } from "./config/db.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { Server } from "socket.io";
import websocket from "./config/websocket.js";
import { getIPAddress } from "./utils/functions.js";
import authRoutes from "./routes/auth/auth.js";
import { authOptionalMiddleware } from "./middlewares/authOptionalMiddleware.js";
import meetRoutes from "./routes/meet.js";
import settingsRoutes from "./routes/settings.js";

import { certOptions } from "./utils/cert.js";
import googleAuthRoutes from "./routes/auth/google_auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const USE_HTTPS = process.env.USE_HTTPS === 'TRUE';

const allowUrl = [
  `http://localhost:5173`,
  `http://${getIPAddress()}:5173`,
  `https://${getIPAddress()}:${HTTPS_PORT}`,
  `http://${getIPAddress()}:${HTTP_PORT}`,
  'https://localhost:3000',
  'http://localhost:3000'
];

// app.get('/', (req, res) => {
//   res.send('Backend is working');
// });
const optionalAuthRoutes = [
  /^\/$/,
  /^\/assets\//,
  /^\/auth\/(?!verify|update-profile|logout).*$/,
  /^\/api\/auth\/(?!verify|update-profile).*$/,
];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: allowUrl, credentials: true }));

app.use(authOptionalMiddleware(optionalAuthRoutes))
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/lobby', meetRoutes);
app.use('/api/settings', settingsRoutes);


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, "dist")));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


let server;

try {
  if (USE_HTTPS) {
    server = createHttpsServer(certOptions, app);
    server.listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server is running on port https://localhost:${HTTPS_PORT} https://${getIPAddress()}:${HTTPS_PORT}`);
      initializeDatabases();
      initializeSocketIO(server);
    });
  } else {
    server = createHttpServer(app);
    server.listen(HTTP_PORT, () => {
      console.log(`HTTP Server is running on port http://localhost:${HTTP_PORT} http://${getIPAddress()}:${HTTP_PORT}`);
      initializeDatabases();
      initializeSocketIO(server);
    });
  }
} catch (error) {
  console.error("Failed to start with the current configuration. Error:", error);
  if (USE_HTTPS) {
    console.log("Falling back to HTTP server");
    server = createHttpServer(app);
    server.listen(HTTP_PORT, () => {
      console.log(`Fallback HTTP Server is running on port http://localhost:${HTTP_PORT} http://${getIPAddress()}:${HTTP_PORT}`);
      initializeDatabases();
      initializeSocketIO(server);
    });
  }
}

function initializeDatabases() {
  redisDB.run().catch(console.dir);
  mongoDB.run().catch(console.dir);
}

function initializeSocketIO(server) {
  const io = new Server(server, {
    adapter: createAdapter(redisDB.client),
    cors: {
      origin: [allowUrl],
      credentials: true
    },

  });



  websocket.getConnection(io);
}