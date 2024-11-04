import PropTypes from "prop-types"
import ActionTab from "./ActionTab"

export default function Footer({ className, socket }) {
    return <div className={className}>
        <ActionTab socket={socket} className="flex justify-center gap-5 items-center h-full" />
    </div>
}

Footer.propTypes = {
    className: PropTypes.string,
    socket: PropTypes.object
}