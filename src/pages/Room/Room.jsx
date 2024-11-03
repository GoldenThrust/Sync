import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addPeer, createPeer } from "../../utils/peer.js";
import { baseURL } from "../../utils/constant.js";
import { useParams } from "react-router-dom";
import Video from "./components/Video.jsx";
import "../../styles/room.css";
import VideoGrid from "./VideoGrid.jsx";
import cVid from "../../assets/codedeploy.mp4"
import Vid from "../../assets/download.mp4"
import SideBar from "./SideBar.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function Room() {
    const [videos, setVideos] = useState([]);
    const { id } = useParams();
    const remotePeer = useRef([]);

    const socketRef = useRef(io(baseURL, {
        withCredentials: true,
        query: { id },
    }));

    useEffect(() => {
        const socket = socketRef.current;
        let localStream;

        const initializeMediaStream = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: { aspectRatio: { exact: 16 / 9 } },
                    audio: {
                        sampleRate: 10,
                        sampleSize: 16,
                        channelCount: 2,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });

                setVideos(prev => [...prev, <Video stream={localStream} userID={1} key={localStream.id} muted={true} />])


                socket.on('connected-users', (users) => {
                    (users || []).forEach(userID => {
                        const newRemotePeer = createPeer(socket, localStream, userID);
                        remotePeer.current.push({ id: userID, peer: newRemotePeer });

                        newRemotePeer.on('stream', (stream) => {
                            setVideos(prev => [...prev, <Video stream={stream} userID={userID} key={stream.id} />]);
                            console.log('Stream', stream.getTracks());
                        });
                        console.log(newRemotePeer)
                    })

                })


                socket.on('rtc-signal', (signal, callerID) => {
                    const newRemotePeer = addPeer(socket, localStream, callerID);
                    remotePeer.current.push({ id: callerID, peer: newRemotePeer });

                    newRemotePeer.signal(signal);

                    newRemotePeer.on('stream', (remoteStream) => {
                        setVideos(prev => [...prev, <Video stream={remoteStream} userID={callerID} key={remoteStream.id} />]);
                    });

                    console.log('rtc-signal', newRemotePeer)
                });
            } catch (err) {
                console.error('Failed to get user media:', err);
            }
        };

        initializeMediaStream();

        socket.on('return-rtc-signal', (signal, peerID) => {
            if (remotePeer.current) {
                const peer = remotePeer.current.find(peer => peer.id === peerID);
                console.log(peer.id === peerID, peer)
                peer.peer.signal(signal);

                console.log('return rtc-signal received', peerID, peer, signal);
            }
            console.log('Received signal from return user', signal);
        });

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }

            remotePeer.current.forEach(rPeer => rPeer.removeAllListeners());
            remotePeer.current = [];

            socket.emit('end-call');

            socket.removeAllListeners();
            setVideos([]);
        };
    }, []);

    
    
    const vod = [Vid, cVid]
    const video = Array.from({ length: 20 }, (_, i) => <video src={vod[Math.floor(Math.random() * 2)]} key={i} />);



    return (
        <div className="h-screen w-screen flex">
            <div className="flex flex-col w-full lg:w-4/5 h-full">
                <Header className="flex border-b-2 border-slate-200 border-opacity-20 flex-grow shadow-lg shadow-slate-900" />
                <VideoGrid videos={videos} style={{ height: '80%' }} />
                <Footer className="flex-grow" />
            </div>
            <SideBar className="hidden flex-col lg:flex w-1/5" />
        </div>
    );
}
