import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

export default function Video({ user, stream, muted = false, facingMode ='user',className = '' }) {
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

    return <video ref={videoRef} autoPlay playsInline muted={muted} id={user.id} className={`overflow-hidden ${className} ${!isMobile || facingMode === "user" ? "-scale-x-100" : "scale-x-100"}`} />
}

Video.propTypes = {
    user: PropTypes.object.isRequired,
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool,
    className: PropTypes.string,
};
