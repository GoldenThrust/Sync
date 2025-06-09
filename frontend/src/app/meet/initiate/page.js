
import Head from "../../../lib/components/ui/meet/Head";
import MeetingPass from "./meetPass";
import MeetingSettings from "./meetSettings";


export default function CreateRoom() {

    return <div id="lobby">
        <Head className="absolute top-3 left-1" />
        <h2 className="text-3xl md:text-5xl font-serif text-center">Synchronize with Others</h2>
        <p className="text-center">{`Safe, Reliable and Fun. That's Sync.`}</p>
        <MeetingPass />
        <hr className="w-4/5 md:w-1/3 h-2 border-black border-t-2" />

        <div className="w-full flex items-center flex-col space-y-2">
            <MeetingSettings />
        </div>
    </div>
}