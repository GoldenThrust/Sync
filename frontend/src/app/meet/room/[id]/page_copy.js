import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Video from "../../../../lib/components/ui/Video";
import { getSettings, updateSettings } from "../../../../lib/settings/settingsAction";
// import axios from "axios";
import { io } from "socket.io-client";
import { baseUrl } from "../../../../lib/utils/constants";
import { addPeer, createPeer } from "../../../../lib/utils/peer";
import { isMobile } from "react-device-detect";
// import Header from "@/lib/components/ui/meet/Header";
import VideoGrid from "../../../../lib/components/ui/meet/VideoGrid";
import Footer from "../../../../lib/components/ui/meet/Footer";
// import SideBar from "@/lib/components/ui/meet/SideBar";
import { AudioLines, PhoneOff, SwitchCamera, VideoIcon } from "lucide-react";
import { endCall, toggleAudio, toggleCamera, toggleFacingMode } from "../../../../lib/utils/actions";
import { toggleTrack } from "../../../../lib/utils/mediaSettings";

export default function Lobby() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [videoStream, setVideoStream] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [remoteVideos, setRemoteVideos] = useState({});
    const socketRef = useRef(null);
    const remotePeer = useRef({});
    const { settings } = useSelector((state) => state.settings);
    const [actions, setActions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    useEffect(() => {
        let localStream;

        // Initialize media stream
        const initializeMediaStream = async () => {
            try {
                console.log(settings)
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: settings.settings.video,
                    audio: settings.settings.audio,
                });
                setMediaStream(localStream);

                setVideoStream(
                    <Video stream={localStream} user={{ ...settings.user, id: socketRef.current.id }} muted className={`${settings.settings.video.facingMode === 'user' ? '-scale-x-100' : 'scale-x-100'} w-full h-full`} />
                );
                socketRef.current.emit('get-active-users', id)
            } catch (error) {
                console.error("Error initializing media stream:", error.message);
            }
        };

        // Function to create a new peer connection
        const createNewPeer = (user, settings) => {
            if (!localStream) return;
            const newRemotePeer = createPeer(socketRef.current, localStream, user.id);
            remotePeer.current[user.email] = newRemotePeer;

            newRemotePeer.on("stream", (stream) => {
                setRemoteVideos((prev) => {
                    return {
                        ...prev,
                        [user.email]: <Video stream={stream} className={`overflow-hidden ${!isMobile || settings.video?.facingMode === "user" ? "-scale-x-100" : "scale-x-100"}`} key={`video-${stream.id}`} user={user} />
                    }
                })
            });
        };


        // Add a new peer when receiving a signal
        const addNewPeer = (callerID, signal, user, settings) => {
            const newRemotePeer = addPeer(socketRef.current, localStream, callerID);
            newRemotePeer.signal(signal);
            remotePeer.current[user.email] = newRemotePeer;

            newRemotePeer.on("stream", (stream) => {
                setRemoteVideos((prev) => {
                    return {
                        ...prev,
                        [user.email]: <Video stream={stream} className={`overflow-hidden ${!isMobile || settings.video?.facingMode === "user" ? "-scale-x-100" : "scale-x-100"}`} key={`video-${stream.id}`} user={user} />
                    }
                })
            });
        };



        if (settings) {
            initializeMediaStream();

            socketRef.current = io(baseUrl, {
                withCredentials: true,
                query: { id },
            });


            socketRef.current.on('active-users', (users) => {
                users.forEach(({ user, settings }) => {
                    createNewPeer(user, settings);
                });
            })

            socketRef.current.on("connect", () => {
                console.log("Socket connected:", socketRef.current.id);
            });

            socketRef.current.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socketRef.current.on("rtc-signal", (signal, callerID, user, settings) => {
                addNewPeer(callerID, signal, user, settings);
            });

            socketRef.current.on("return-rtc-signal", (signal, email) => {
                if (remotePeer.current[email]) {
                    remotePeer.current[email].signal(signal);
                }
            });

            socketRef.current.on("user-disconnected", (user) => {
                if (remotePeer.current[user.email]) {
                    remotePeer.current[user.email].destroy();
                    delete remotePeer.current[user.email];
                }

                setRemoteVideos((prev) => {
                    delete prev[user.email];

                    return {
                        ...prev
                    }
                })
            });

            return () => {
                console.log("Cleaning up...");
                Object.values(remotePeer.current).forEach((peer) => {
                    peer.removeAllListeners();
                    peer.destroy();
                });
                remotePeer.current = {};

                localStream?.getTracks().forEach((track) => track.stop());
                socketRef.current?.emit("end-call");
                socketRef.current?.removeAllListeners();
                socketRef.current?.disconnect();
            };
        }
    }, [id, settings]);


    useEffect(() => {
        if (settings && mediaStream) {
            const newActions = [
                {
                    logo: <VideoIcon color={settings.settings.enabledVideo ? "white" : "red"} />,
                    func: () => dispatch(toggleCamera(updateSettings, settings)),
                },
                {
                    logo: <AudioLines color={settings.settings.enabledAudio ? "white" : "red"} />,
                    func: () => dispatch(toggleAudio(updateSettings, settings)),
                },
                {
                    logo: <PhoneOff color="red" />,
                    func: () => endCall(socketRef.current, navigate, mediaStream),
                },
            ];

            if (isMobile) {
                newActions.push({
                    logo: <SwitchCamera />,
                    func: () => {
                        dispatch(toggleFacingMode(updateSettings, settings, mediaStream));
                    },
                });
            }

            setVideoStream(
                <Video stream={mediaStream} user={{ ...settings.user, id: socketRef.current.id }} muted className={`${settings.settings.video.facingMode === 'user' ? '-scale-x-100' : 'scale-x-100'} w-full h-full`} />
            );

            setActions(newActions);
            toggleTrack(mediaStream, "audio", settings.settings.enabledAudio);
            toggleTrack(mediaStream, "video", settings.settings.enabledVideo);
        }
    }, [mediaStream, settings, dispatch, navigate]);


    return (
        <div className="h-screen w-screen" id="room">
            {/* <Header className="flex border-b-2 p-2 bg-slate-900 bg-opacity-75 border-slate-200 border-opacity-20 flex-grow shadow-lg shadow-slate-900 absolute top-0 left-0 w-full z-10" /> */}
            <VideoGrid videos={remoteVideos} localVideo={videoStream} />
            <Footer socket={socketRef.current} actions={actions} className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full p-2 bg-slate-900 bg-opacity-80 z-10" />
            {/* {false && <SideBar className="hidden flex-col lg:flex w-1/5" />} */}
        </div>
    );
}
