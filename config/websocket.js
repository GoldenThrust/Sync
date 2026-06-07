import { mongo } from "mongoose";
import socketCookieParser from "../middlewares/socketCookieParser.js";
import socketAuthenticateToken from "../middlewares/socketTokenManager.js";
import Session from "../models/session.js";
import Settings from "../models/settings.js";
import User from "../models/user.js";

class WebSocketManager {
    constructor() {
        this.io = null;
        this.userSessions = new Map();
    }

    async getConnection(io) {
        io.use(socketCookieParser);
        io.use(socketAuthenticateToken);

        this.io = io;

        io.on("connection", async (socket) => {
            const { id } = socket.handshake.query;
            const user = {
                ...socket.user,
                id: socket.id,
            };

            await User.findByIdAndUpdate(socket.user.id, {
                socketId: socket.id
            })

            try {
                const session = await Session.findOne({ sessionId: id });
                const settings = await Settings.findOne({ user: socket.user.id });

                if (!session) {
                    socket.emit("error", "Session not found");
                    console.error("Session not found");
                    socket.disconnect();
                    return;
                }

                this.userSessions.delete(socket.user.email);
                this.userSessions.set(socket.user.email, { id: socket.user.id, room: id, user });
                socket.join(id);

                await Session.findOneAndUpdate(
                    { sessionId: id },
                    { $pull: { activeUsers: socket.user.id } },
                );

                session.activeUsers.push(socket.user.id);
                await session.save()

                console.log(
                    `Connected to WebSocket ${socket.user.email}`,
                    id,
                    socket.id
                );

                socket.on("rtc-signal", (signal, userID) => {
                    console.log(`Recieve RTC: ${userID}`);
                    socket.to(userID).emit("rtc-signal", signal, socket.id, user, settings);
                });

                socket.on("return-rtc-signal", (signal, callerID) => {
                    socket.to(callerID).emit("return-rtc-signal", signal, socket.user.email);
                });

                socket.on("end-call", () => {
                    socket.disconnect();
                });

                socket.on("screen-share", (sharing)=> {
                    socket.to(id).emit("screen-share", sharing);
                })

                socket.on("disconnect", async () => {
                    console.log("Disconnected from WebSocket", socket.user.email);

                    const { room, user } = this.userSessions.get(socket.user.email) || {};
                    this.userSessions.delete(socket.user.email);

                    if (room) {
                        socket.to(room).emit("user-disconnected", user);
                    }

                    if (session) {
                        await Session.findOneAndUpdate(
                            { sessionId: id },
                            { $pull: { activeUsers:  socket.user.id } }
                        );
                    }
                });

                socket.on("get-active-users", async () => {
                    console.log("getting active user");
                    try {
                        const session = await Session.findOne({ sessionId: id }).populate("activeUsers");

                        if (session) {
                            const response = [];
                            for (const userObj of session.activeUsers) {
                                if (userObj.email !== socket.user.email) {
                                    const { id, user } = this.userSessions.get(userObj.email) || {};

                                    if (!id) continue;
                        
                                    const userSettings = await Settings.findOne({ user: id });
                                    response.push({ settings: userSettings, user });
                                }
                            }

                            socket.emit("active-users", response);
                        }
                    } catch (error) {
                        console.error(error);
                        socket.emit("error", error);
                    }
                });
            } catch (error) {
                console.error("WebSocket connection error:", error);
                socket.disconnect();
            }
        });

        return true;
    }
}

const websocket = new WebSocketManager();
export default websocket;
