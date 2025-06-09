"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AudioLines, MoreHorizontal, SwitchCamera, Video as VidLogo } from "lucide-react";
import { isMobile } from "react-device-detect";

import Video from "../../../../lib/components/ui/Video";

import ActionTab from "../../../../lib/components/ui/meet/ActionTab";
import Settings from "../../../../lib/components/ui/meet/Settings";
import { getSettings, updateSettings } from "../../../../lib/settings/settingsAction";
import { toggleTrack } from "../../../../lib/utils/mediaSettings";
import { toggleAudio, toggleCamera, toggleFacingMode } from "../../../../lib/utils/actions";

export default function LobbyClient({ id, Link }) {
    const dispatch = useDispatch();
    const [videoStream, setVideoStream] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [initiated, setInitiated] = useState(false);
    const [actions, setActions] = useState([]);

    const { settings } = useSelector((state) => state.settings);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (settings && mediaStream && user) {
            const newActions = [
                { logo: <MoreHorizontal />, func: () => setSettingsOpen(true) },
                {
                    logo: <VidLogo color={settings.settings.enabledVideo ? "white" : "red"} />,
                    func: () => dispatch(toggleCamera(updateSettings, settings)),
                },
                {
                    logo: <AudioLines color={settings.settings.enabledAudio ? "white" : "red"} />,
                    func: () => dispatch(toggleAudio(updateSettings, settings)),
                },
            ];

            if (isMobile) {
                newActions.push({
                    logo: <SwitchCamera />,
                    func: () => {
                        dispatch(toggleFacingMode(updateSettings, settings, mediaStream, setInitiated));
                    },
                });
            }

            setVideoStream(
                <div className="w-1/2 md:w-1/3 rounded-xl border-4 border-slate-800 overflow-hidden">
                    {console.log(settings)}
                    <Video stream={mediaStream} user={user} muted className={settings.settings.video.facingMode === 'user' ? `-scale-x-100` : 'scale-x-100'} />
                </div>
            );

            setActions(newActions);
            toggleTrack(mediaStream, "audio", settings.settings.enabledAudio);
            toggleTrack(mediaStream, "video", settings.settings.enabledVideo);
        }
    }, [mediaStream, settings, dispatch, user]);

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    useEffect(() => {
        let stream;
        const initializeMediaStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: settings.settings.video, audio: settings.settings.audio });
                setMediaStream(stream);
            } catch (error) {
                console.log("Error initializing media stream:", error.message);
                alert(error.message)
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
    }, [settings, initiated, mediaStream]);

    return (
        <>
            {videoStream}
            <div>
                <ActionTab className="flex justify-center gap-5 items-center h-full" actions={actions} />
            </div>
            {Link}
            {settingsOpen && <Settings setSettingsOpen={setSettingsOpen} />}
        </>
    );
}
