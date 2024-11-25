import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addPeer, createPeer } from "../../../utils/peer.js";
import { baseURL } from "../../../utils/constant.js";
import { useParams } from "react-router-dom";
import "../../../styles/room.css";
import { PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Video from "../../../components/ui/Video.jsx";

export default function Room() {
    const { id } = useParams();
    const [localVideo, setLocalVideo] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteVideo, setRemoteVideo] = useState(null);
    const [remotePeer, setRemotePeer] = useState(null);

    const navigate = useNavigate();

    const socketRef = useRef(io(baseURL, {
        withCredentials: true,
        query: { id },
    }));

    console.log()

    useEffect(() => {
        const socket = socketRef.current;
        let localStream;

        const initializeMediaStream = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        aspectRatio: { exact: 16 / 9 },
                    },
                    audio: {
                        sampleRate: 10,
                        sampleSize: 16,
                        channelCount: 2,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });

                setLocalStream(localStream);

                const newRemotePeer = createPeer(socket, localStream, id);
                setRemotePeer(newRemotePeer)

                newRemotePeer.on('stream', (stream) => {
                    setRemoteVideo(<Video stream={stream} userID='remote' key={0} muted={true} />);
                });

                socket.on('rtc-signal', (signal, callerID) => {
                    const newRemotePeer = addPeer(socket, localStream, callerID);
                    newRemotePeer.signal(signal);

                    newRemotePeer.on('stream', (stream) => {
                        setRemoteVideo(<Video stream={stream} userID='remote' key={2} muted={true} />);
                    });
                });
            } catch (err) {
                console.error("Failed to get user media:", err);
            }
        };

        initializeMediaStream()

        socket.on("user-disconnected", () => {
            setRemotePeer(null)
            setRemoteVideo(null);
        });


        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            setRemotePeer(null)

            socket.emit("end-call");
            socket.removeAllListeners();
        };
    }, [id]);

    useEffect(() => {
        setLocalVideo(<Video stream={localStream} userID='local' key={0} muted={true} className={`rounded-lg shadow-slate-200 shadow-lg absolute bottom-2 right-2 ${remoteVideo ? `w-1/5 h-1/4` : "w-full h-full"} bg-slate-900`} />);
    }, [localStream, remoteVideo])

    useEffect(() => {
        socketRef.current.on('return-rtc-signal', (signal) => {
            if (remotePeer) {
                remotePeer.signal(signal);
            }
        });
    }, [remotePeer])

    const endCall = () => {
        socketRef.current.emit('end-call');
        navigate('/', { replace: true });
    };

    return (
        <div className="h-screen w-screen flex">
            {localVideo}
            {remoteVideo}
            <div className="absolute bottom-4 left-2/4 bg-slate-700 bg-opacity-20 shadow-lg shadow-slate-600 p-2">
                <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={endCall} >
                    <PhoneOff color="red" />
                </span>
            </div>
        </div>
    );
}
