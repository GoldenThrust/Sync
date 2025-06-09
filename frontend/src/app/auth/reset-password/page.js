"use client";
import { useForm } from "react-hook-form";
import FormField from "../../../lib/components/ui/form/FormField";
import Button from "../../../lib/components/ui/form/Button";

export default function ResetPassword() {
    const hook = useForm();
    const { handleSubmit } = hook;

    const form = [
        { name: 'password', type: "password", placeholder: "Password" , required: true},
        { name: '_c', type: "password", placeholder: "Confirm Password", required: true },
    ]

    const forgotPassword = () => {

    }


    return (
            <form onSubmit={handleSubmit(forgotPassword)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <legend className="text-4xl font-mono font-bold">Reset Password</legend>
                <FormField data={form} hook={hook} className="w-full" />

                <div className="w-full space-y-2">
                    <Button value="LOGIN" className="w-full font-bold" />
                </div>
            </form>
    );
}