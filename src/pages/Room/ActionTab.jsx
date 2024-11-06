// import { MoreHorizontal, PhoneOff, SwitchCamera, Video } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ActionTab({ className, action }) {
    // export default function ActionTab({ className, socket, localStream, action }) {
    // const navigate = useNavigate();
    // const [facingUser, setFacingUser] = useState(true);

    // const endCall = () => {
    //     socket.emit('end-call');
    //     navigate('/', { replace: true });
    // };

    // const SwitchCameraFunc = () => {
    //     setFacingUser((prevFacingUser) => !prevFacingUser);

    //     const videoTracks = localStream?.getVideoTracks();
    //     videoTracks?.forEach(async (track) => {
    //         await track.applyConstraints({ facingMode: facingUser ? 'environment' : 'user' });
    //     });
    // };

    return (
        <div className={className}>
            {action.map((act, index) =>
                <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={act.func} key={index}>
                    {act.logo}
                </span>
            )}
            {/* <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping">
                <MoreHorizontal />
            </span>
            <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={endCall}>
                <PhoneOff color="red" />
            </span>
            <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping">
                <Video />
            </span>
            <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={SwitchCameraFunc}>
                <SwitchCamera />
            </span> */}
        </div>
    );
}

ActionTab.propTypes = {
    className: PropTypes.string,
    socket: PropTypes.object.isRequired,
    localStream: PropTypes.object,
    action: PropTypes.arrayOf(PropTypes.object).isRequired,
};
