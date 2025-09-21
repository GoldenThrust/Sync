import socketCookieParser from "../middlewares/socketCookieParser.js";
import socketAuthenticateToken from "../middlewares/socketTokenManager.js";
import Session from "../models/session.js";
import Settings from "../models/settings.js";

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

            try {
                const session = await Session.findOne({ sessionId: id });
                const settings = await Settings.findOne({ user: socket.user.id });

                if (!session) {
                    socket.emit("error", "Session not found");
                    console.error("Session not found");
                    socket.disconnect();
                    return;
                }

                this.userSessions.set(socket.user.email, { id: socket.user.id, room: id, user });
                socket.join(id);

                await Session.findOneAndUpdate(
                    { sessionId: id },
                    { $pull: { activeUsers: { email: socket.user.email } } },
                );

                console.log(
                    `Connected to WebSocket ${socket.user.email}`,
                    id,
                    socket.id
                );

                socket.on("rtc-signal", (signal, userID) => {
                    socket.to(userID).emit("rtc-signal", signal, socket.id, user, settings);
                });

                socket.on("return-rtc-signal", (signal, callerID) => {
                    socket.to(callerID).emit("return-rtc-signal", signal, socket.user.email);
                });

                socket.on("end-call", () => {
                    console.log(socket.id, `${socket.user.email} ended call`);
                    socket.disconnect();
                });

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
                            { $pull: { activeUsers: { id: socket.id } } }
                        );
                    }
                });

                socket.on("get-active-users", async () => {
                    try {
                        const session = await Session.findOne({ sessionId: id });

                        if (session) {
                            const response = [];
                            for (const userObj of session.activeUsers) {
                                if (userObj.email !== socket.user.email) {
                                    const { id } = this.userSessions.get(userObj.email) || {};
                                    const userSettings = await Settings.findOne({ user: id });
                                    response.push({ settings: userSettings, user: userObj });
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
