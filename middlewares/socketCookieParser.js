import cookieParser from "cookie-parser";
import process from "process";

export default function socketcookieParser(socket, next) {
    console.log("Cookie parser");
    cookieParser(process.env.COOKIE_SECRET)(socket.request, {}, (err) => {
        if (err) {
            console.error("Error parsing cookie:", err);
            return next(err);
        }
        
        next();
    });
}