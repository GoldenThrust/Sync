import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 443;
const allowUrl = [`http://localhost:5173`, `http://${getIPAddress()}:5173`, `https://${getIPAddress()}:${PORT}`, 'https://localhost:3000'];


const app = express();


const server = createServer(app);
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
app.use('/api/meet', meetRoutes);
app.use('/api/settings', settingsRoutes);


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});



server.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}  https://${getIPAddress()}:${PORT}`);

  mongoDB.run().catch(console.dir)
  redisDB.run().catch(console.dir)

  const io = new Server(server, {
    adapter: createAdapter(redisDB.client),
    cors: {
      origin: [allowUrl],
      credentials: true
    },

  });


  websocket.getConnection(io);
});

export default app;
