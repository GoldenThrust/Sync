import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addPeer, createPeer } from "../../utils/peer.js";
import { baseURL } from "../../utils/constant.js";
import { useParams, useNavigate } from "react-router-dom";
import Video from "../../components/ui/Video.jsx";
import "../../styles/room.css";
import VideoGrid from "./VideoGrid.jsx";
import SideBar from "./SideBar.jsx";
import Footer from "./Footer.jsx";

// Import icons
import { MoreHorizontal, PhoneOff, SwitchCamera, Video as VidLogo } from "lucide-react";
import Header from "./components/Header.jsx";

export default function Room() {
    const { id } = useParams();
    const navigate = useNavigate();
    const remotePeer = useRef({});
    const socketRef = useRef(io(baseURL, { withCredentials: true, query: { id } }));
    const [videos, setVideos] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [facingUser, setFacingUser] = useState(true);

    useEffect(() => {
        const socket = socketRef.current;

        const initializeMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        aspectRatio: { exact: 16 / 9 },
                        facingMode: 'user'
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

                setLocalStream(mediaStream);

                // Set local stream in remotePeer for self-view
                remotePeer.current[0] = {
                    peer: { removeAllListeners: () => { } },
                    video: <Video stream={mediaStream} userID={'0'} key={0} muted={true} />
                };
                updateVideos();

                // Listen for connected users
                socket.on('connected-users', (users) => {
                    users?.forEach((userID) => {
                        const newRemotePeer = createPeer(socket, mediaStream, userID);
                        remotePeer.current[userID] = { peer: newRemotePeer };

                        newRemotePeer.on('stream', (stream) => {
                            remotePeer.current[userID] = { peer: newRemotePeer, video: <Video stream={stream} userID={userID} key={stream.id} /> };
                            updateVideos();
                        });
                    });
                });

                // Handle incoming RTC signals
                socket.on('rtc-signal', (signal, callerID) => {
                    const newRemotePeer = addPeer(socket, mediaStream, callerID);
                    newRemotePeer.signal(signal);
                    remotePeer.current[callerID] = { peer: newRemotePeer };

                    newRemotePeer.on('stream', (stream) => {
                        remotePeer.current[callerID] = { peer: newRemotePeer, video: <Video stream={stream} userID={callerID} key={stream.id} /> };
                        updateVideos();
                    });
                });
            } catch (err) {
                console.error("Failed to get user media:", err);
            }
        };

        const updateVideos = () => {
            remotePeer.current = Object.values(remotePeer.current).filter(peer => peer.video);
            setVideos(Object.values(remotePeer.current).map(peer => peer.video));
        };

        initializeMediaStream();

        socket.on('return-rtc-signal', (signal, peerID) => {
            if (remotePeer.current[peerID]) {
                remotePeer.current[peerID].peer.signal(signal);
            }
        });

        socket.on("user-disconnected", (peerID) => {
            if (remotePeer.current[peerID]) {
                remotePeer.current[peerID].peer.removeAllListeners();
                delete remotePeer.current[peerID];
                updateVideos();
            }
        });

        socket.emit('get-connected-users');

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            Object.values(remotePeer.current).forEach(rPeer => rPeer.peer.removeAllListeners());
            remotePeer.current = {};
            socket.emit("end-call");
            socket.removeAllListeners();
        };
    }, [localStream]);

    const endCall = () => {
        socketRef.current.emit('end-call');
        navigate('/', { replace: true });
    };

    const replaceMediaStream = async () => {
        try {
            // Request a new media stream with the updated facing mode
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    aspectRatio: { exact: 16 / 9 },
                    // facingMode: 'user'
                    facingMode: facingUser ? 'user' : 'environment'
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

            // Stop the tracks of the previous stream to free up resources
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }

            // Set the new stream for the local video component and update the state
            setLocalStream(newStream);
            remotePeer.current[0] = {
                peer: { removeAllListeners: () => { } },
                video: <Video stream={newStream} userID={'0'} key={0} muted={true} />
            };

            Object.values(remotePeer.current).forEach((rPeer, index) => {
                if (index === 0) return;
                console.log(rPeer.peer, index);
                rPeer.peer.replaceTrack(
                    localStream.getVideoTracks()[0], // TODO: use curent track
                    newStream.getVideoTracks()[0],
                    localStream
                );
            });

            const updateVideos = () => {
                remotePeer.current = Object.values(remotePeer.current).filter(peer => peer.video);
                setVideos(Object.values(remotePeer.current).map(peer => peer.video));
            };

            updateVideos()
        } catch (err) {
            console.error("Failed to get user media:", err);
        }
        console.log('Stream replaced');
    };

    const SwitchCameraFunc = () => {
        setFacingUser(prevFacingUser => !prevFacingUser);
        replaceMediaStream();
    };

    const action = [
        { logo: <MoreHorizontal />, func: () => { } },
        { logo: <PhoneOff color="red" />, func: endCall },
        { logo: <VidLogo />, func: () => { } },
        { logo: <SwitchCamera />, func: SwitchCameraFunc }
    ];

    return (
        <div className="h-screen w-screen flex">
            <div className="flex flex-col w-full lg:w-4/5 h-full">
                <Header className="flex border-b-2 border-slate-200 border-opacity-20 flex-grow shadow-lg shadow-slate-900" />
                <VideoGrid videos={videos} style={{ height: "80%" }} />
                <Footer socket={socketRef.current} localStream={localStream} action={action} className="flex-grow" />
            </div>
            <SideBar className="hidden flex-col lg:flex w-1/5" />
        </div>
    );
}