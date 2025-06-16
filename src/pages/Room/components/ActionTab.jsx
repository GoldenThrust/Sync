// import { MoreHorizontal, PhoneOff, SwitchCamera, Video } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ActionTab({ className, actions }) {
    return (
        <div className={className}>
            {actions.map((act, index) =>
                <span className="button w-14 aspect-square flex justify-center items-center rounded-full cursor-pointer active:animate-ping" onClick={act.func} key={index}>
                    {act.logo}
                </span>
            )}
        </div>
    );
}

ActionTab.propTypes = {
    className: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
};
