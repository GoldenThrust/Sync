import PropTypes from "prop-types";
import { useEffect, useRef } from "react";


export default function Video({ userID, stream, muted = false }) {
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

    return <video ref={videoRef} autoPlay playsInline muted={muted} id={userID} />;
}

Video.propTypes = {
    userID: PropTypes.string.isRequired,
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool
};
