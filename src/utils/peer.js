import Peer from "simple-peer";

export function createPeer(socket, stream, userID) {
    const peer = new Peer({ initiator: true, stream, trickle: false });
    peer.on("signal", (signal) => {
        socket.emit('rtc-signal', signal, userID);
    });

    peer.on("error", (err) => {
        console.error("Error in createPeer:", err);
    });

    return peer;
}

export function addPeer(socket, stream, callerID) {
    const peer = new Peer({ initiator: false, stream, trickle: false });
    peer.on("signal", (signal) => {
        socket.emit('return-rtc-signal', signal, callerID);
    });

    peer.on("error", (err) => {
        console.error("Error in addPeer:", err);
    });

    return peer;
}
