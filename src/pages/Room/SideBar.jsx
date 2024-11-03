import PropTypes from "prop-types"
import ChatSection from "./ChatSection"
import { MessageSquareText, Users } from "lucide-react"
import { useState } from "react"

export default function SideBar({ className }) {
    const [selectedSection, setSelectedSection] = useState('message');

    const handleSectionClick = (section) => () => {
        setSelectedSection(section);
    }


    return <div className={className} >
        <div className="h-90">
            <ChatSection className="bg-blue-950 flex flex-col h-full" asChild />
        </div>
        <div className="flex-grow grid grid-cols-2   place-items-center bg-black border-t-2 border-slate-700 rounded-ss-lg">
            <button onClick={handleSectionClick('message')} className={`flex h-1/2 focus:animate-pulse aspect-video justify-center items-center rounded-lg bg-opacity-55 ${selectedSection == 'message' && 'bg-slate-400'}`}><MessageSquareText color="white" /></button>
            <button onClick={handleSectionClick('users')} className={`flex h-1/2 focus:animate-pulse aspect-video justify-center items-center rounded-lg bg-opacity-55 ${selectedSection == 'users' && 'bg-slate-400'}`} ><Users color="white" /></button>
        </div>
    </div>
}

SideBar.propTypes = {
    className: PropTypes.string
}