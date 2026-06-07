import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Video from "../../components/ui/Video";
import { getSettings, updateSettings } from "../../settings/settingsAction";
import { io } from "socket.io-client";
import { baseUrl } from "../../utils/constant";
import { addPeer, createPeer } from "../../utils/peer";
import VideoGrid from "./components/VideoGrid";
import Footer from "./components/Footer";
import { AudioLines, MonitorUp, PhoneOff, SwitchCamera, VideoIcon } from "lucide-react";
import { endCall, toggleAudio, toggleCamera, toggleFacingMode } from "../../utils/actions";
import { toggleTrack } from "../../utils/mediaSettings";
import { isMobile } from "react-device-detect";
import { getActiveSessionUsersUsername } from "../../session/sessionAction";

export default function Lobby() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [videoStream, setVideoStream] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [remoteVideos, setRemoteVideos] = useState({});
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [sharingScreen, setSharingScreen] = useState(null);
    const socketRef = useRef(null);
    const remotePeer = useRef({});
    const { settings } = useSelector((state) => state.settings);
    const { users } = useSelector((state) => state.session);
    const { user } = useSelector((state) => state.auth);
    const [actions, setActions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSettings());
        dispatch(getActiveSessionUsersUsername(id));
    }, [dispatch, id]);

    // ── start screen share ────────────────────────────────────────────────────
    const startScreenShare = useCallback(async () => {
        if (!mediaStream) return;
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: false,
            });

            const screenTrack = screenStream.getVideoTracks()[0];

            // show screen in local preview
            const newMediaStream = new MediaStream([
                screenTrack,
                ...mediaStream.getAudioTracks(),
            ]);

            setMediaStream(newMediaStream)

            setVideoStream(
                <Video
                    stream={newMediaStream}
                    user={{ ...settings.user, id: socketRef.current?.id }}
                    muted
                    className="w-full h-full object-contain bg-slate-950"
                />
            );
            setIsSharingScreen(true);

            // browser's native "Stop sharing" button fires this
            screenTrack.addEventListener("ended", getMediaStream);
        } catch (err) {
            // user cancelled the picker — not an error worth surfacing
            if (err.name !== "NotAllowedError") {
                console.error("Screen share error:", err);
            }
        }
    }, [mediaStream, settings]);

    const getMediaStream = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: settings?.settings?.video,
                audio: settings?.settings?.audio,
            });

            setMediaStream(mediaStream);

            setVideoStream(
                <Video
                    stream={mediaStream}
                    user={{ ...settings?.user, id: socketRef.current.id }}
                    muted
                    className={`${settings?.settings?.video?.facingMode === "user" ? "-scale-x-100" : "scale-x-100"} w-full h-full`}
                />
            );

            setIsSharingScreen(false);
        } catch (error) {
            console.error("Error initializing media stream:", error.message);
        }
    }, [settings]);

    // ── toggle handler (used in Footer actions) ───────────────────────────────
    const toggleScreenShare = useCallback(() => {
        if (isSharingScreen) getMediaStream();
        else startScreenShare();
    }, [isSharingScreen, startScreenShare, getMediaStream]);


    const createNewPeer = useCallback((user, peerSettings) => {
        console.log("creating Pear", mediaStream)
        if (!mediaStream) return;
        const newRemotePeer = createPeer(socketRef.current, mediaStream, user.socketId);
        remotePeer.current[user.email] = newRemotePeer;
        newRemotePeer.on("stream", (stream) => {
            setRemoteVideos((prev) => ({
                ...prev,
                [user.email]: (
                    <Video
                        stream={stream}
                        facingMode={peerSettings.video?.facingMode}
                        key={`video-${stream.id}`}
                        user={user}
                    />
                ),
            }));
        });
    }, [mediaStream]);

    const addNewPeer = useCallback((callerID, signal, user, peerSettings) => {
        console.log("adding peer signal", mediaStream);
        if (!mediaStream) return;
        const newRemotePeer = addPeer(socketRef.current, mediaStream, callerID);
        newRemotePeer.signal(signal);
        remotePeer.current[user.email] = newRemotePeer;
        newRemotePeer.on("stream", (stream) => {
            setRemoteVideos((prev) => ({
                ...prev,
                [user.email]: (
                    <Video
                        stream={stream}
                        facingMode={peerSettings.video?.facingMode}
                        key={`video-${stream.id}`}
                        user={user}
                    />
                ),
            }));
        });
    }, [mediaStream]);

    useEffect(() => {
        socketRef.current = io(baseUrl, {
            withCredentials: true,
            query: { id },
        });

        socketRef.current.on("connect", () =>
            console.log("Socket connected:", socketRef.current.id)
        );
        socketRef.current.on("disconnect", () => console.log("Socket disconnected"));
        socketRef.current.on("rtc-signal", (signal, callerID, user, s) =>
            addNewPeer(callerID, signal, user, s)
        );
        socketRef.current.on("return-rtc-signal", (signal, email) => {
            remotePeer.current[email]?.signal(signal);
        });

        socketRef.current.on("screen-share", (email) => setSharingScreen(email));
        socketRef.current.on("user-disconnected", (user) => {
            remotePeer.current[user.email]?.destroy();
            delete remotePeer.current[user.email];
            setRemoteVideos((prev) => {
                const next = { ...prev };
                delete next[user.email];
                return next;
            });
        });


        return () => {
            Object.values(remotePeer.current).forEach((peer) => {
                peer.removeAllListeners();
                peer.destroy();
            });
            remotePeer.current = {};
            socketRef.current?.removeAllListeners();
            socketRef.current?.emit("end-call");
            socketRef.current?.disconnect();
        };
    }, [id, addNewPeer]);

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
                    // screen share button — green tint when active
                    logo: <MonitorUp color={isSharingScreen ? "#22c55e" : "white"} />,
                    func: toggleScreenShare,
                },
                {
                    logo: <PhoneOff color="red" />,
                    func: () => {
                        endCall(socketRef.current, navigate, mediaStream);
                    },
                },
            ];

            if (isMobile) {
                newActions.splice(3, 0, {
                    logo: <SwitchCamera />,
                    func: () => dispatch(toggleFacingMode(updateSettings, settings, mediaStream)),
                });
            }

            // only re-set the local preview if NOT currently screen sharing
            // if (!isSharingScreen) {
            //     setVideoStream(
            //         <Video
            //             stream={mediaStream}
            //             user={{ ...settings.user, id: socketRef.current?.id }}
            //             muted
            //             className={`${settings.settings.video.facingMode === "user" ? "-scale-x-100" : "scale-x-100"} w-full h-full`}
            //         />
            //     );
            // }

            setActions(newActions);
            toggleTrack(mediaStream, "audio", settings.settings.enabledAudio);
            toggleTrack(mediaStream, "video", settings.settings.enabledVideo);
        }
    }, [mediaStream, settings, isSharingScreen, toggleScreenShare, dispatch, navigate]);

    useEffect(() => {
        if (users && mediaStream) {
            users?.forEach(({ user, settings: s }) => {
                createNewPeer(user, s)
            });
        }
    }, [users, mediaStream, createNewPeer])


    useEffect(() => {
        if (settings) {
            getMediaStream()
        }
    }, [settings, getMediaStream]);

    useEffect(() => {
        if (user)
            socketRef.current.emit("screen-share", isSharingScreen ? user?.email : null);
    }, [isSharingScreen, user])


    return (
        <div className="h-screen w-screen" id="room">
            <VideoGrid videos={remoteVideos} localVideo={videoStream} sharingScreen={sharingScreen} />
            <Footer
                socket={socketRef.current}
                actions={actions}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full p-2 bg-slate-900/80 z-10"
            />
        </div>
    );
}