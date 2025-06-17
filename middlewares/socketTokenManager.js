
import { COOKIE_NAME } from "../utils/constants.js";
import jwt from "jsonwebtoken";
import process from "process";

export default function socketAuthenticateToken(socket, next) {
  const req = socket.request;
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.signedCookies[COOKIE_NAME];
  }
  if (!token || token.trim() === "") {
    return socket.status(401).json({ response: "Token Not Received" });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtData = jwt.verify(token, jwtSecret);
    socket.user = jwtData;
    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return socket.status(401).json({ response: "Token Expired or Invalid" });
  }
}
