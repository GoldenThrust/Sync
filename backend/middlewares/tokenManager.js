import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants.js";
import process from "process";

export function createToken(user, expiresIn) {
  const payload = { id: user._id.toString(), email: user.email, fullname: user.fullname, image: user.image };
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn,
  });

  return token;
}

export async function verifyToken(req, res, next) {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === "") {
    if (!req.path.startsWith('/api')) {
      return res.redirect('/auth/login');
    }
    return res.status(401).json({ response: "Token Not Received" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtData = jwt.verify(token, jwtSecret);
    res.jwt = jwtData;
    return next();
  } catch (error) {
    if (!req.path.startsWith('/api')) {
      return res.redirect('/auth/login');
    }
    console.error("Token verification error:", error);
    return res.status(401).json({ response: "Token Expired or Invalid" });
  }
}
