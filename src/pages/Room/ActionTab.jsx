import { MoreHorizontal, PhoneOff, SwitchCamera, Video } from "lucide-react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom";

export default function ActionTab({ className, socket }) {
    const navigate = useNavigate();

    const endCall = () => {
        socket.emit('end-call');
        navigate('/', {
            replace: true,
        })
    }

    return <div className={className}>
        <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping">
            <MoreHorizontal />
        </span>
        <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={endCall}>
            <PhoneOff color="red" />
        </span>
        <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping">
            <Video />
        </span>
        <span className="bg-slate-600 w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping">
            <SwitchCamera />
        </span>
    </div>
}
ActionTab.propTypes = {
    className: PropTypes.string,
    socket: PropTypes.object
}