"use client";
import OneFormField from "../../../lib/components/ui/form/OneFormField";
import { Link, Video } from "lucide-react";

export default function MeetingPass() {
    const joinMeeting = () => {

    }

    return <OneFormField FormIcon={<Link />} SubmitIcon={<Video />} name="url" placeholder="Enter Link or passcode to join meeting" type="text" className="w-4/5 md:w-1/3" OnSubmit={joinMeeting} />
}