import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addPeer, createPeer } from "../utils/peer.js";
import { baseURL } from "../utils/constant.js";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

function Video({ stream }) {
    const videoRef = useRef();

    useEffect(() => {
        const videoCurrent = videoRef.current;
        if (videoCurrent) {
            videoCurrent.srcObject = stream;
            videoCurrent.play();
        }

        return () => {
            if (videoCurrent?.srcObject) {
                videoCurrent.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline />;
}

Video.propTypes = {
    stream: PropTypes.object.isRequired,
};

export default function Test() {
    const videoRef = useRef(null);
    const [remoteVideos, setRemoteVideos] = useState([]);
    const { id } = useParams();
    const remotePeer = useRef([]);

    const socketRef = useRef(io(baseURL, {
        withCredentials: true,
        query: { id },
    }));

    useEffect(() => {
        const videoCurrent = videoRef.current;
        const socket = socketRef.current;
        let localStream;

        const initializeMediaStream = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: { aspectRatio: 16 / 9 },
                    audio: {
                        sampleRate: 10,
                        sampleSize: 16,
                        channelCount: 2,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });

                
                if (videoCurrent) {
                    videoCurrent.srcObject = localStream;
                    videoCurrent.play();
                }
                
                socket.on('connected-users', (users) => {
                    console.log('connected', users);
                    (users || []).forEach(userID => {
                        const newRemotePeer = createPeer(socket, localStream, userID);
                        remotePeer.current.push({ id: userID, peer: newRemotePeer });
                        
                        newRemotePeer.on('stream', (stream) => {
                            setRemoteVideos(prev => [...prev, <Video stream={stream} key={stream.id} />]);
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
                        setRemoteVideos(prev => [...prev, <Video stream={remoteStream} key={remoteStream.id} />]);
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
            if (videoCurrent?.srcObject) {
                videoCurrent.srcObject.getTracks().forEach(track => track.stop());
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }

            remotePeer.current.forEach(rPeer => rPeer.removeAllListeners());
            remotePeer.current = [];

            socket.emit('end-call');

            socket.removeAllListeners();
            setRemoteVideos([]);
        };
    }, []);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline />
            {remoteVideos.map((video, index) => (
                <div key={index}>
                    {video}
                </div>
            ))}
        </>
    );
}
