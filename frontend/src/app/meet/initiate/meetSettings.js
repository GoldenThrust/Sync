"use client";
import Button from "../../../lib/components/ui/form/Button";

export default function MeetingSettings() {
    const instantMeeting = () => {
        // Logic to start an instant meeting
        const id = uuid(); // Assuming uuid is imported from a library
        console.log(`Starting instant meeting with ID: ${id}`);
        // Redirect or perform further actions
    }

    const scheduleMeeting = () => {

    }

    return <>
        <Button value="Start instant meeting" className="w-4/5 md:w-1/3 font-bold" onClick={instantMeeting} />
        <div className="text-center font-mono">OR</div>
        <Button value="Schedule Meeting" className="w-4/5 md:w-1/3 font-bold" onClick={scheduleMeeting} />
    </>
}