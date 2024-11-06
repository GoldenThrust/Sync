import PropTypes from "prop-types"
import ActionTab from "./ActionTab"

export default function Footer({ className, socket, localStream, action }) {

    return <div className={className}>
        <ActionTab className="flex justify-center gap-5 items-center h-full" localStream={localStream} socket={socket} action={action}/>
    </div>
}

Footer.propTypes = {
    className: PropTypes.string,
    socket: PropTypes.object,
    localStream: PropTypes.object,
    action: PropTypes.arrayOf(PropTypes.object).isRequired,
}