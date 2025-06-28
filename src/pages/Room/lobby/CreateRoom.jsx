import { Link, Video } from "lucide-react";
import OneFormField from "../../../components/ui/form/OneFormField";
import Head from "../components/Head";
import Button from "../../../components/ui/form/Button";
import { useNavigate } from "react-router-dom";
import { v7 as uuid } from 'uuid';
import { useCallback, useState } from "react";
import InputField from "../../../components/ui/form/InputField";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";


export default function CreateRoom() {
    const [openMeetingScheduler, setOpenMeetingScheduler] = useState(false);
    const navigate = useNavigate();
    const joinMeeting = () => {

    }

    const instantMeeting = () => {
        const id = uuid();
        navigate(`/meet/waiting-room/${id}`);
    }


    return <div id="lobby">
        <Head className="absolute top-3 left-1" />
        <h2 className="text-3xl md:text-5xl font-serif text-center">Synchronize with Others</h2>
        <p className="text-center">{`Safe, Reliable and Fun. That's Sync.`}</p>
        <OneFormField FormIcon={<Link />} SubmitIcon={<Video />} name="url" placeholder="Enter Link or passcode to join meeting" type="text" className="w-4/5 md:w-1/3" OnSubmit={joinMeeting} />
        <hr className="w-4/5 md:w-1/3 h-2 border-black border-t-2" />

        <div className="w-full flex items-center flex-col space-y-2">
            <Button value="Start instant meeting" className="w-4/5 md:w-1/3 font-bold" onClick={instantMeeting} />
            <div className="text-center font-mono">OR</div>
            <Button value="Schedule Meeting" className="w-4/5 md:w-1/3 font-bold" onClick={() => { setOpenMeetingScheduler(true) }} />
            {openMeetingScheduler && <MeetingScheduler setOpenMeetingScheduler={setOpenMeetingScheduler} />}
        </div>
    </div>
}



function MeetingScheduler({ setOpenMeetingScheduler }) {
    const { register, handleSubmit } = useForm();
    // const onSubmit = (data) => {
    //     console.log(data);
    //     setOpenMeetingScheduler(false);
    // }
    const fields = [
        {
            name: 'title', type: 'text', header: "Meeting Title", placeholder: 'Enter meeting title', required: true, className: 'text-white'
        },
        {
            name: 'date', type: 'datetime-local', header: "Meeting Date", placeholder: 'Date', required: true
        },
        {
            name: 'privacy', type: 'select', header: "Privacy", required: true, options: ['Public', 'Private']
        },
        {
            name: 'time', type: 'time', header: "Duration", placeholder: 'Time', required: true
        },
        {
            name: 'invite', type: 'text', header: "Invitees", placeholder: 'Enter email addresses', required: false, className: 'text-white'
        }
    ];

    const scheduleMeeting = useCallback(async (data) => {
        toast.loading('Scheduling meeting...');
        const response = await axios.post('/meet/schedule', data);

        if (response.data.meeting && response.data.meeting.id) { 
            toast.success('Meeting scheduled successfully');
            navigate(`/meet/waiting-room/${response.data.meeting.id}`);
        } else {
            toast.error('Error scheduling meeting');
            console.error('Error scheduling meeting:', error);
        }
    
        setOpenMeetingScheduler(false);
    }, [])


    return <div className="absolute top-0 left-0 w-screen h-screen flex justify-center flex-col items-center bg-black/90 gap-5 z-20">
        <h2 className="text-3xl md:text-5xl font-serif text-center">Schedule a Meeting</h2>
        <form onSubmit={handleSubmit(scheduleMeeting)} className="gap-5 md:w-1/3 w-11/12 space-y-1">
            {
                fields.map((field, index) => (
                    <InputField key={index} data={field} register={register} color="#dfe6e9" />
                ))
            }
            <Button onClick={() => { setOpenMeetingScheduler(false) }} value={'Schedule'} className="w-full" />
            <div className="text-center font-mono">OR</div>
            <Button onClick={() => { setOpenMeetingScheduler(false) }} value={'Close'} className="w-full" />
        </form>
    </div >
}