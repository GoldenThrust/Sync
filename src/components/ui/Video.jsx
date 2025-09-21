import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function Video({ user, stream, muted = false, className }) {
    const videoRef = useRef();

    useEffect(() => {
        const videoCurrent = videoRef.current;

        if (videoCurrent) {
            if (videoCurrent.srcObject !== stream) {
                videoCurrent.srcObject = stream;
            }

            const playVideo = async () => {
                try {
                    await videoCurrent.play();
                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error("Error playing video stream:", error);
                    }
                }
            };

            playVideo();
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline muted={muted} id={user.id} className={className} key={`video-${stream.id}`} />
}

Video.propTypes = {
    user: PropTypes.object.isRequired,
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool,
    className: PropTypes.string,
};
