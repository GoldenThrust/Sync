import Peer from "simple-peer";
const iceServersConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" },
        { urls: "stun:stun.ekiga.net" },
        { urls: "stun:stun.ideasip.com" },
        { urls: "stun:stun.rixtelecom.se" },
        { urls: "stun:stun.schlund.de" },
        { urls: "stun:stunprotocol.org:3478" },
        { urls: "stun:stun.voiparound.com" },
        { urls: "stun:stun.voipbuster.com" },
        { urls: "stun:stun.voipstunt.com" },
        { urls: "stun:stun.voxgratia.org" },
        {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credentials: 'openrelayproject'
        },
        {
            urls: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
        },
        {
            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        }
    ]
};

export function createPeer(socket, stream, userID) {
    const peer = new Peer({ initiator: true, stream, trickle: false, config: iceServersConfig });
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
