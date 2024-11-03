import PropTypes from "prop-types";
import { useEffect, useRef } from "react";


export default function Video({ stream, muted = false }) {
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

    return <video ref={videoRef} autoPlay playsInline muted={muted} />;
}

Video.propTypes = {
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool
};
