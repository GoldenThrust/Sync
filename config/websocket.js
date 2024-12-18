import socketcookieParser from "../middlewares/socketCookieParser.js";
import socketAuthenticateToken from "../middlewares/socketTokenManager.js";
import { redisDB } from "./db.js";

class WebSocketManager {
    constructor() {
        this.io = null;
        this.id = null;
        this.room = null;
        this.socket = null;
        this.connected = false;
    }

    async getConnection(io) {
        io.use(socketcookieParser);
        io.use(socketAuthenticateToken);
    
        this.io = io;

        await new Promise((resolve, reject) => {
            io.on("connection", async (socket) => {
                const { id } = socket.handshake.query;
                this.room = id;
                this.id = socket.id;
                this.socket = socket;
                socket.join(id);
                this.connected = true;
                const users = await redisDB.getArray(`room_${this.room}`);

                socket.on("get-connected-users", ()=> {
                    setTimeout(() => {
                        console.log('getting connected users');
                        socket.emit('connected-users', users);
                    }, 1000)
                })

                await redisDB.setArray(`room_${this.room}`, socket.id, 24 * 60 * 60);


                socket.on('rtc-signal', (signal, userID) => {
                    socket.to(userID).emit("rtc-signal", signal, socket.id);
                })

                socket.on('return-rtc-signal', (signal, callerID) => {
                    socket.to(callerID).emit("return-rtc-signal", signal, socket.id)
                })

                socket.on('end-call', () => {
                    socket.disconnect()
                })

                socket.on("disconnect", async () => {
                    console.log(`Disconnected from WebSocket`, socket.id);
                    socket.to(this.room).emit('user-disconnected', socket.id);
                    await redisDB.delArray(`room_${this.room}`, socket.id)
                    reject('disconnect');
                    this.connected = false;
                });

                console.log(`Connected to WebSocket`, id, socket.id);
                resolve(this.connected);
            });
        });

        return this.connected;
    }
}

const websocket = new WebSocketManager();
export default websocket;
