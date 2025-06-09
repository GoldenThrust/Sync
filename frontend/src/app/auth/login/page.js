"use client";
import { useForm } from "react-hook-form";
import FormField from "../../../lib/components/ui/form/FormField";
import Button from "../../../lib/components/ui/form/Button";
import googleIcon from "@/lib/assets/icons/google.svg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../lib/authentication/authAction";
import Image from "next/image";
import Link from "next/link";


export default function Login() {
    const hook = useForm();
    const { handleSubmit } = hook;
    const dispatch = useDispatch();
    const { loginerror } = useSelector((state) => state.auth)




    const form = [
        { name: 'email', type: "email", placeholder: "Email Address" },
        { name: 'password', type: "password", placeholder: "Password" },
    ]

    const googleSignIn = () => {

    }

    const signIn = (data) => {
        dispatch(login(data));
    }

    return (
            <form onSubmit={handleSubmit(signIn)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <legend className="text-5xl font-mono font-bold">Sign In</legend>
                <FormField data={form} hook={hook} className="w-full" />

                {loginerror && <p className="text-red-600">{loginerror}</p>}
                <div className="w-full space-y-2">
                    <div className="flex justify-between">
                        <Link href='/auth/forgot-password'>Forgot Password</Link>
                        <span>
                            {`Don't have an account?`}  <Link href='/auth/signup'>Sign Up</Link> </span>
                    </div>
                    <Button value="LOGIN" className="w-full font-bold" />
                    <div className="text-center">OR</div>
                    <Button type="button" onClick={googleSignIn} value={<div className="flex justify-center gap-2"><Image src={googleIcon} className="w-6" alt="Google Icon" /> Sign in with Google</div>} className="w-full font-bold" />
                </div>
            </form>
    );
}
