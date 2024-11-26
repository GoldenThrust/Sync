import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function Video({ userID, stream, muted = false, className }) {
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

        return () => {
            if (videoCurrent.srcObject) {
                videoCurrent.srcObject.getTracks().forEach((track) => track.stop());
                videoCurrent.srcObject = null;
            }
        };
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline className={className} muted={muted} id={userID} />;
}

Video.propTypes = {
    userID: PropTypes.string.isRequired,
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool,
    className: PropTypes.string,
};
