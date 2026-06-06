import PropTypes from "prop-types"
import Button from "../../../components/ui/form/Button"
import OneFormField from "../../../components/ui/form/OneFormField"
import { Link, Send, X } from "lucide-react"
import { useCallback, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function Settings({ setSettingsOpen, sessionId }) {
    const [invited, setInvited] = useState(["Dsds"]);

    const SendInvite = useCallback(async () => {
        const data = {
            sessionId,
            emails: invited
        }

        try {
            toast.loading('Sending invite', { id: sessionId });
            await axios.post('/meet/send-instant-invite', data);
            toast.success('Invite sent', { id: sessionId });

            setSettingsOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to send invite', { id: sessionId });
        }
    }, [invited]);

    const onChange = useCallback(({ target }) => {
        const text = target.value;
        const lastLetter = text[text.length - 1];

        if (lastLetter === ",") {
            setInvited((invited) => [...invited, text.split(",")[0]]);
            target.value = "";
        }
        // if (lastLetter.regex(/^A-Za-z$/)) {
        //     console.log("alphabet");
        // }
        console.log(target.value[target.value.length - 1]);
    }, [])


    return <div className="absolute top-0 left-0 w-screen h-screen flex justify-center flex-col items-center bg-black/90 gap-5 z-20">
        <p className="text-2xl">Invited Guest</p>
        <p className="flex flex=row gap-2">
            {invited.map((value, i) => <p className="bg-slate-800 px-2 py-1 rounded-2xl text-xs flex flex-row justify-center items-center gap-1" onClick={() => setInvited((invited) => invited.toSpliced(i, 1))}>{value} <X className="w-3" color="red"/></p>)}
        </p>

        <OneFormField FormIcon={<Link />} SubmitIcon={<Send />} name="emails" placeholder="Invite friends" type="text" className="w-4/5 md:w-1/3" onChange={onChange} OnSubmit={SendInvite} />
        <Button onClick={() => { setSettingsOpen(false) }} value={'Close'} className="w-4/5 md:w-1/3" />
    </div>
}

Settings.propTypes = {
    setSettingsOpen: PropTypes.func.isRequired,
}