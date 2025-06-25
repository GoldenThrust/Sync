import PropTypes from "prop-types"
import Button from "../../../components/ui/form/Button"
import OneFormField from "../../../components/ui/form/OneFormField"
import { Link, Send } from "lucide-react"
import { useCallback } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function Settings({ setSettingsOpen,sessionId }) {

    const SendInvite = useCallback(async (data) => {
        data['sessionId'] = sessionId;

        try {
            toast.loading('Sending invite', { id: sessionId });
            await axios.post('/meet/send-instant-invite', data);
            toast.success('Invite sent', { id: sessionId });

            setSettingsOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to send invite', { id: sessionId });
        }
    }, []);


    return <div className="absolute top-0 left-0 w-screen h-screen flex justify-center flex-col items-center bg-black/90 gap-5 z-20">
        <OneFormField FormIcon={<Link />} SubmitIcon={<Send />} name="emails" placeholder="Invite friends" type="text" className="w-4/5 md:w-1/3" OnSubmit={SendInvite} />
        <Button onClick={() => { setSettingsOpen(false) }} value={'Close'} className="w-4/5 md:w-1/3" />
    </div>
}

Settings.propTypes = {
    setSettingsOpen: PropTypes.func.isRequired,
}