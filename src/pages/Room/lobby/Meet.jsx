import Head from "../components/Head";
import Button from "../../../components/ui/form/Button";
import Video from "../../../components/ui/Video";
import { useEffect, useState } from "react";
import ActionTab from "../ActionTab";
import { MoreHorizontal, SwitchCamera, Video as VidLogo } from "lucide-react";

export default function Lobby() {
    const [video, setVideo] = useState(null);

    useEffect(() => {
        let mediaStream;
        const initializeMediaStream = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
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
    
                setVideo(<Video stream={mediaStream} className="w-1/3 h-auto rounded-xl border-solid border-4 border-slate-800" userID={'0'} key={0} muted={true} />)
            } catch (e) {
                console.error('Error: ' + e.message);
            }
        };
    
        initializeMediaStream();
        return ()=> {
            mediaStream?.getTracks().forEach(track => track.stop());
        }
    }, [])

    const joinMeeting = () => {

    };

    const action = [
        { logo: <MoreHorizontal />, func: () => { } },
        { logo: <VidLogo />, func: () => { } },
        { logo: <SwitchCamera />, func: () => { } },
    ];


    return <div id="lobby">
        <Head className="absolute top-3 left-1" />
        {video}
        <div><ActionTab className="flex justify-center gap-5 items-center h-full" action={action}/></div>
        <Button value="Join Chat" className="w-1/3 font-bold" onClick={joinMeeting} />
    </div>
}