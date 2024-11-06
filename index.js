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
import { getIPAddress } from "./utils.js";
// import { v4 as uuid } from "uuid";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 443;
const allowUrl = "0.0.0.0/0";


const app = express();

const server = createServer(app);

app.use(cors({ origin: allowUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// app.get("/", (_, res) => {
//   const url = `/${uuid()}`;
//   return res.redirect(url);
// });

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
      origin: 'http://localhost:5173',
      credentials: true
    },
    
  });


  websocket.getConnection(io);
});

export default app;
