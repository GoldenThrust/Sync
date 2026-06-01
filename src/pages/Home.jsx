import SyncLogo from '../assets/sync.svg';
import { Link } from "react-router-dom";

import AISubtitle from "../assets/features/aisubtitle.png"
import ChatTranslation from "../assets/features/chattranslation.png"
import Encryption from "../assets/features/encryption.png"
import MultiDevice from "../assets/features/multidevice.png"
import RealTime from "../assets/features/realtime.png"
import ScreenShare from "../assets/features/screenshare.png"
import GithubIcon from "../assets/icons/github.svg"
import LinkedInIcon from "../assets/icons/linkedin.svg"
import TwitterIcon from "../assets/icons/twitter.svg"
import { Mail, Send, Menu } from "lucide-react";
import Button from "../components/ui/form/Button";
import OneFormField from "../components/ui/form/OneFormField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "../components/ui/form/FormField";
import { useSelector } from "react-redux";

export default function Home() {
    const messageFormHook = useForm();

    const { handleSubmit: messageSubmit } = messageFormHook;
    const { isAuthenticated } = useSelector((state) => state.auth)



    const contactUs = [
        { name: 'email', type: "email", placeholder: "Enter your Email", className: '' },
        { name: 'message', type: "textarea", placeholder: "Enter Message", className: 'h-28 resize-none' },
    ]

    const onMessageSubmit = (data) => {
        console.log(data);
    }

    const onNewsLetterSubmit = (data) => {
        console.log(data);
    }


    return <div id="homepage" className="space-y-10">
        <header className="flex my-5 justify-between">
            <div>
                <img src={SyncLogo} alt="Sync Logo" className="w-14 drop-shadow-2xl drop-shadow-amber-50/50" />
                <h1 className="sr-only">Sync</h1>
            </div>

            <Link to={`${isAuthenticated ? "/auth/logout" : "/auth/login"}`} className="bg-color w-28 rounded-lg p-2 text-center text-white hidden md:block" style={{
                color: '#fff'
            }}>{isAuthenticated ? 'Logout' : 'Login'}</Link>
            <Link
                to={`${isAuthenticated ? "/auth/logout" : "/auth/login"}`}
                className="md:hidden text-white bg-black px-4 py-2 rounded-lg"
                style={{
                    color: '#fff'
                }}
            >
                {isAuthenticated ? 'Logout' : 'Login'}
            </Link>
        </header>

        <main className="space-y-16">
            <section className=" px-4 w-full lg:w-1/2 mt-16 mb-24 text-center lg:text-left">
                <div className="text-4xl md:text-6xl lg:text-8xl font-serif md:text-slate-800 text-shadow">Synchronize for work, play, and Everything in between</div>
                <div className="my-3 text-slate-600">A single platform for all your communication need</div>
                <Link to={isAuthenticated ? "/meet/initiate" : "/auth/signup"} className="block bg-color mx-auto lg:mx-0 w-40 rounded-ss-2xl rounded-ee-2xl p-3 text-md font-medium font-serif text-center text-white" style={{
                    color: '#fff'
                }}>{isAuthenticated ? 'Start Meeting' : 'Get Started'}</Link>
            </section>
        </main>

        <footer className="absolute w-full right-0 space-y-5">
            <div className="flex flex-col md:flex-row justify-around p-10 bg-color w-11/12 m-auto rounded-xl font-serif text-white mb-16 shadow-2xl shadow-black backdrop-blur-sm backdrop-brightness-50 backdrop-contrast-125" style={{
                backgroundColor: '#0a1214b7'
            }}>
                <section className="space-y-2 flex-1/2 flex flex-col justify-between">
                    <div className='space-y-4'>
                        <img src={SyncLogo} alt="Sync Logo" className="w-14 md:m-0 m-auto h-14 drop-shadow-2xl drop-shadow-amber-50/50" />
                        <div className="text-xl font-bold">Video Chat, Reimagined.</div>
                        <div className="text-sm">{`Sync isn’t just another video chat app; it's a space for real connection, seamless interaction, and trusted privacy. Whether you’re catching up with friends, joining study groups, or hosting virtual meetups, Sync brings everyone together effortlessly.`}</div>
                    </div>
                    <div>
                        Follow Us:
                        <div className="flex mt-2 space-x-4">
                            <Link to="https://github.com/GoldenThrust" className="w-10 block p-3 bg-color rounded-full" ><img src={GithubIcon} alt="Github Icon" /></Link>
                            <Link to="https://www.linkedin.com/in/olajide-adeniji/" className="w-10 block p-3 bg-color rounded-full" ><img src={LinkedInIcon} alt="LinkedIn Icon" /></Link>
                            <Link to="https://x.com/Goldenthrust3" className="w-10 block p-3 bg-color rounded-full" ><img src={TwitterIcon} alt="Twitter Icon" /></Link>
                        </div>
                    </div>
                </section>

                <section className="space-y-5 flex-1/2">
                    <div className="space-y-2">
                        <div className="text-xl font-bold">NEWSLETTER</div>
                        <OneFormField name="email" placeholder="Enter Your Email" FormIcon={<Mail />} SubmitIcon={<Send />} type="email" OnSubmit={onNewsLetterSubmit} className="md:w-3/4 w-full" />
                    </div>
                    <div className="grid gap-4" >
                        <div className="text-xl font-bold">Contact Us:</div>
                        <form className="space-y-3 w-full" onSubmit={messageSubmit(onMessageSubmit)}>
                            <FormField data={contactUs} hook={messageFormHook} className="md:w-3/4 w-full" />
                            <Button value="Send" className="md:w-3/4 w-full" />
                        </form>
                    </div>
                </section>
            </div>
            <div className="bg-color m-0 h-18 text-white text-center p-3">Copyright © 2024 Sync. All Right Reserved</div>
        </footer>
    </div>
}