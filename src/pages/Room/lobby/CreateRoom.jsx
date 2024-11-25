import { Link, Video } from "lucide-react";
import OneFormField from "../../../components/ui/form/OneFormField";
import Head from "../components/Head";
import Button from "../../../components/ui/form/Button";

export default function CreateRoom() {
    const joinMeeting = () => {

    }

    const instantMeeting = () => {
        
    }

    const scheduleMeeting = () => {

    }
    return <div id="lobby">
        <Head className="absolute top-3 left-1" />
        <h2 className="text-3xl md:text-5xl font-serif text-center">Synchronize with Others</h2>
        <p className="text-center">{`Safe, Reliable and Fun. That's Sync.`}</p>
        <OneFormField FormIcon={<Link />} SubmitIcon={<Video />} name="url" placeholder="Enter Link or passcode to join meeting" type="text" className="w-1/3" OnSubmit={joinMeeting} />
        <hr className="w-1/3 h-2 border-black border-t-2" />

        <div className="w-full flex items-center flex-col space-y-2">
            <Button value="Start instant meeting" className="w-1/3 font-bold" onClick={instantMeeting} />
            <div className="text-center font-mono">OR</div>
            <Button value="Schedule Meeting" className="w-1/3 font-bold" onClick={scheduleMeeting} />
        </div>
    </div>
}