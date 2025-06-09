"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import FormField from "../../../lib/components/ui/form/FormField";
import Button from "../../../lib/components/ui/form/Button";
import googleIcon from "@/lib/assets/icons/google.svg";
import Otp from "../../../lib/components/ui/auth/Otp";
import { AuthError } from "../../../lib/authentication/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../../lib/authentication/authAction";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
    const hook = useForm();
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.auth)

    const { handleSubmit, register } = hook;
    const [otpOpen, setOtpOpen] = useState(false);
    const [preview, setPreview] = useState(null);


    const form = [
        { name: 'fullname', type: "text", placeholder: "Full Name", required: true },
        { name: 'email', type: "email", placeholder: "Email Address", required: true },
        { name: 'password', type: "password", placeholder: "Password", required: true },
        { name: '_c', type: "password", placeholder: "Confirm Password", required: true },
    ]

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const googleSignUp = () => {

    }

    const signUp = (data) => {
        if (data['_c'] !== data['password']) {
            dispatch(AuthError('Password does not match'));
        } else {
            delete data['_c'];

            const form = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'image') {
                    form.append(key, value[0])
                } else {
                    form.append(key, value)
                }
            });
            dispatch(signup(form, setOtpOpen))
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(signUp)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <label
                    htmlFor="image"
                    className="block w-24 aspect-square rounded-full overflow-hidden bg-slate-600 relative"
                >
                    <input
                        type="file"
                        {...register("image", { required: true })}
                        className="w-full h-full opacity-0 absolute"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {preview ? (
                        <Image src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white flex items-center justify-center w-full h-full">
                            Upload pics
                        </span>
                    )}
                </label>
                <FormField data={form} hook={hook} className="w-full" />
                {error && <p className="text-red-600">{error}</p>}
                <div className="w-full space-y-2">
                    <div className="text-end text-sm">Already have an account? <Link href='/auth/login' >Sign In</Link> </div>
                    <Button value="SIGN UP" className="w-full font-bold" />
                    <div className="text-center">OR</div>
                    <Button type="button" onClick={googleSignUp} value={<div className="flex justify-center gap-2"><Image src={googleIcon} className="w-6" alt="Google Icon" /> Sign up with Google</div>} className="w-full font-bold" />
                </div>
            </form>
            {otpOpen && <Otp setOtpOpen={setOtpOpen} />}
        </>
    );
}
