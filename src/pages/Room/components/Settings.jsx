import PropTypes from "prop-types"
import Button from "../../../components/ui/form/Button"
import OneFormField from "../../../components/ui/form/OneFormField"
import { Link, Send } from "lucide-react"
import { useCallback } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function Settings({ setSettingsOpen }) {

    const SendInvite = useCallback(async (data) => {
        try {
            toast.loading('Sending invite', { id: 'invite' });
            await axios.post('/lobby/send-invite', data);
            toast.success('Invite sent', { id: 'invite' });
        } catch (err) {
            console.error(err);
            toast.error('Failed to send invite', { id: 'invite' });
        }
    }, []);


    return <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center z-20 bg-black bg-opacity-50">
        <OneFormField FormIcon={<Link />} SubmitIcon={<Send />} name="email" placeholder="Invite friends" type="email" className="w-4/5 md:w-1/3" OnSubmit={SendInvite} />
        <Button onClick={() => { setSettingsOpen(false) }} value={'Close'} />
    </div>
}

Settings.propTypes = {
    setSettingsOpen: PropTypes.func.isRequired,
}