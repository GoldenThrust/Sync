import Peer from "simple-peer";

const iceServersConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun.stunprotocol.org" },
        { urls: "stun:stun.voipstunt.com" },
        {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        },
        {
            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            username: 'webrtc',
            credential: 'webrtc'
        }
    ]
};



export function createPeer(socket, stream, userID) {
    const peer = new Peer({ initiator: true, stream, trickle: false, config: iceServersConfig });

    console.log('sending peer signal')
    peer.on("signal", (signal) => {
        console.log("send rtc-signal", signal);
        socket.emit('rtc-signal', signal, userID);
    });

    peer.on("error", (err) => {
        console.error("Error in createPeer:", err);
    });

    return peer;
}

export function addPeer(socket, stream, callerID) {
    const peer = new Peer({ initiator: false, stream, trickle: false, config: iceServersConfig });
    peer.on("signal", (signal) => {
        console.log("receive & returning rtc-signal", signal);
        socket.emit('return-rtc-signal', signal, callerID);
    });

    peer.on("error", (err) => {
        console.error("Error in addPeer:", err);
    });

    return peer;
}
