import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addPeer, createPeer } from "../../utils/peer.js";
import { useParams, useNavigate } from "react-router-dom";
import Video from "../../components/ui/Video.jsx";
import "../../styles/room.css";
import VideoGrid from "./components/VideoGrid.jsx";
import SideBar from "./components/SideBar.jsx";
import Footer from "./components/Footer.jsx";

// Import icons
import { AudioLines, MoreHorizontal, PhoneOff, SwitchCamera, Video as VidLogo } from "lucide-react";
import Header from "./components/Header.jsx";
import { baseUrl } from "../../utils/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { toggleTrack } from "../../utils/mediaSettings.js";
import { endCall, toggleAudio, toggleCamera, toggleFacingMode } from "../../utils/actions.js";
import { getSettings, updateSettings } from "../../settings/settingsAction.js";
import { isMobile } from "react-device-detect";

export default function Room() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const remotePeer = useRef({});
    const socketRef = useRef(io(baseUrl, { withCredentials: true, query: { id } }));
    const [videos, setVideos] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [initiated, setInitiated] = useState(false);
    const [actions, setActions] = useState([]);

    const { settings } = useSelector((state) => state.settings);

    const updateVideos = () => {
        remotePeer.current = Object.values(remotePeer.current).filter(peer => peer.video);
        setVideos(Object.values(remotePeer.current).map(peer => peer.video));
    };

    // Fetch settings when component mounts
    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);


    useEffect(() => {
        if (settings && localStream) {
            const newActions = [
                { logo: <MoreHorizontal />, func: () => { } },
                {
                    logo: <VidLogo color={settings.enabledVideo ? "white" : "red"} />,
                    func: () => dispatch(toggleCamera(updateSettings, settings)),
                },
                { logo: <PhoneOff color="red" />, func: endCall(socketRef.current, navigate) },
                {
                    logo: <AudioLines color={settings.enabledAudio ? "white" : "red"} />,
                    func: () => dispatch(toggleAudio(updateSettings, settings)),
                },
            ];


            if (isMobile) {
                newActions.push({
                    logo: <SwitchCamera />,
                    func: () => {
                        dispatch(toggleFacingMode(updateSettings, settings, localStream, setInitiated));
                    },
                });
            }



            remotePeer.current[0] = {
                peer: { removeAllListeners: () => { } },
                video: <Video stream={localStream} userID={'0'} key={0} muted={true} />
            };
            updateVideos();


            setActions(newActions);
            toggleTrack(localStream, 'audio', settings.enabledAudio);
            toggleTrack(localStream, 'video', settings.enabledVideo);
        }
    }, [localStream, settings, dispatch, navigate]);


    useEffect(() => {
        const socket = socketRef.current;

        const createNewPeer = (userID) => {
            const newRemotePeer = createPeer(socket, localStream, userID);
            remotePeer.current[userID] = { peer: newRemotePeer };
            newRemotePeer.on('stream', (stream) => {
                remotePeer.current[userID] = { peer: newRemotePeer, video: <Video stream={stream} userID={userID} key={stream.id} /> };
                updateVideos();
            });
        };

        const addNewPeer = (callerID, signal) => {
            const newRemotePeer = addPeer(socket, localStream, callerID);
            newRemotePeer.signal(signal);
            remotePeer.current[callerID] = { peer: newRemotePeer };

            newRemotePeer.on('stream', (stream) => {
                remotePeer.current[callerID] = { peer: newRemotePeer, video: <Video stream={stream} userID={callerID} key={stream.id} /> };
                updateVideos();
            });
        }

        // Listen for connected users
        socket.on('connected-users', (users) => {
            users?.forEach((userID) => {
                createNewPeer(userID);
            });
        });

        // Handle incoming RTC signals
        socket.on('rtc-signal', (signal, callerID) => {
            addNewPeer(callerID, signal)
        });


        socket.on('return-rtc-signal', (signal, peerID) => {
            if (remotePeer.current[peerID]) {
                remotePeer.current[peerID].peer.signal(signal);
            }
        });

        socket.on("user-disconnected", (peerID) => {
            if (remotePeer.current[peerID]) {
                delete remotePeer.current[peerID];
                updateVideos();
            }

        });

        socket.emit('get-connected-users');

        return () => {
            socket.emit("end-call");
            socket.removeAllListeners();
            Object.values(remotePeer.current).forEach(rPeer => rPeer.peer.removeAllListeners());
            remotePeer.current = {};
            localStream?.getTracks().forEach((track) => track.stop());
        };
    }, [localStream])

    // Initialize media stream
    useEffect(() => {
        let stream;
        const initializeMediaStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: settings.video, audio: settings.audio });
                setLocalStream(stream);
            } catch (error) {
                console.error("Error initializing media stream:", error.message);
                alert("Unable to access camera/microphone. Please check your permissions.");
            }
        };

        if (settings && initiated === false) {
            setInitiated(true);
            initializeMediaStream();
        }

        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [settings, initiated]);

    return (
        <div className="h-screen w-screen flex" id="room">
            <div className="flex flex-col w-full lg:w-4/5 h-full">
                <Header className="flex border-b-2 border-slate-200 border-opacity-20 flex-grow shadow-lg shadow-slate-900 text-white" />
                <VideoGrid videos={videos} style={{ height: "80%" }} />
                <Footer socket={socketRef.current} localStream={localStream} action={actions} className="flex-grow" />
            </div>
            <SideBar className="hidden flex-col lg:flex w-1/5 text-white" />
        </div>
    );
}