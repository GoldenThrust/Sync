import PropTypes from "prop-types"
import ActionTab from "./ActionTab"
import { useState, useEffect } from "react"

export default function Footer({ className, socket, localStream, actions }) {
    const [visible, setVisibility] = useState(true);
    const [timeId, setTimeId] = useState(null);

    useEffect(() => {
        const showFooter = () => {
            setVisibility(true);
            if (timeId) clearTimeout(timeId);
            const id = setTimeout(() => {
                setVisibility(false);
            }, 10000)

            setTimeId(id);
        }
        window.addEventListener("click", showFooter);

        return () => {
            window.removeEventListener("click", showFooter);
        }
    }, [])



    return <div className={`${className} ${visible ? '' : 'hidden'}`}>
        <ActionTab className="flex justify-center gap-5 items-center h-full" localStream={localStream} socket={socket} actions={actions} />
    </div>
}

Footer.propTypes = {
    className: PropTypes.string,
    socket: PropTypes.object,
    localStream: PropTypes.object,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
}