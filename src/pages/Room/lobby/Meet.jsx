import Head from "../components/Head";
import Button from "../../../components/ui/form/Button";
import Video from "../../../components/ui/Video";
import { useEffect, useState } from "react";
import ActionTab from "../components/ActionTab";
import { AudioLines, MoreHorizontal, SwitchCamera, Video as VidLogo } from "lucide-react";
import Settings from "../components/Settings";
import { useDispatch, useSelector } from "react-redux";
import { getSettings, updateSettings } from "../../../settings/settingsAction";
import { toggleTrack } from "../../../utils/mediaSettings";
import { useParams } from "react-router-dom";
import Link from "../../../components/ui/Link";
import { toggleAudio, toggleCamera, toggleFacingMode } from "../../../utils/actions";
import { isMobile } from "react-device-detect";

export default function Lobby() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [videoStream, setVideoStream] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [initiated, setInitiated] = useState(false);
    const [actions, setActions] = useState([]);

    const { settings } = useSelector((state) => state.settings);

    useEffect(() => {
        if (settings && mediaStream) {
            const newActions = [
                { logo: <MoreHorizontal />, func: () => setSettingsOpen(true) },
                {
                    logo: <VidLogo color={settings.enabledVideo ? "white" : "red"} />,
                    func: () => dispatch(toggleCamera(updateSettings, settings)),
                },
                {
                    logo: <AudioLines color={settings.enabledAudio ? "white" : "red"} />,
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
                    <Video stream={mediaStream} userID="0" key="0" muted className={settings.video.facingMode === 'user' ? `-scale-x-100` : 'scale-x-100'} />
                </div>
            );

            setActions(newActions);
            toggleTrack(mediaStream, "audio", settings.enabledAudio);
            toggleTrack(mediaStream, "video", settings.enabledVideo);
        }
    }, [mediaStream, settings, dispatch]);

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    useEffect(() => {
        let stream;
        const initializeMediaStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: settings.video, audio: settings.audio });
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
        <div id="lobby">
            <Head className="absolute top-3 left-1" />
            {videoStream}
            <div>
                <ActionTab className="flex justify-center gap-5 items-center h-full" action={actions} />
            </div>
            <Link href={`/meet/initiate/${id}`} className="w-4/5 md:w-1/3 font-bold">
                <Button value="Join Chat" className="w-full font-bold" />
            </Link>
            {settingsOpen && <Settings setSettingsOpen={setSettingsOpen} />}
        </div>
    );
}
