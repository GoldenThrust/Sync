"use client";
import Image from "next/image";
import SyncLogo from '@/lib/assets/sync.svg';
import Link from "next/link";
import AISubtitle from "@/lib/assets/features/aisubtitle.png"
import ChatTranslation from "@/lib/assets/features/chattranslation.png"
import Encryption from "@/lib/assets/features/encryption.png"
import MultiDevice from "@/lib/assets/features/multidevice.png"
import RealTime from "@/lib/assets/features/realtime.png"
import ScreenShare from "@/lib/assets/features/screenshare.png"
import GithubIcon from "@/lib/assets/icons/github.svg"
import LinkedInIcon from "@/lib/assets/icons/linkedin.svg"
import TwitterIcon from "@/lib/assets/icons/twitter.svg"
import { Mail, Send, Menu } from "lucide-react";
import Button from "../lib/components/ui/form/Button";
import OneFormField from "../lib/components/ui/form/OneFormField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import FormField from "../lib/components/ui/form/FormField";
import { useSelector } from "react-redux";

export default function Home() {
  const messageFormHook = useForm();

  const { handleSubmit: messageSubmit } = messageFormHook;
  const { isAuthenticated } = useSelector((state) => state.auth)


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerNav = [{
    name: 'About',
    link: '#footer',
  }, {
    name: 'Contact',
    link: '#footer',
  }, {
    name: 'Features',
    link: '#features',
  }, {
    name: 'Pricing',
    link: '#footer',
  },]

  const features = [
    {
      img: RealTime,
      title: 'Real-Time Video Chat',
      description: 'Crystal-clear, real-time video to stay connected, wherever you are.',
    },
    {
      img: MultiDevice,
      title: 'Multi-Device Sync',
      description: 'Easily switch between devices without missing a moment.',
    },
    {
      img: AISubtitle,
      title: 'AI-Powered Subtitles',
      description: 'Automatically generate accurate subtitles for spoken words, enhancing accessibility and clarity in every conversation.',
    },
    {
      img: ScreenShare,
      title: 'Screen Sharing & File Sharing',
      description: "Share what's on your screen or send files in an instant, making collaborations smooth and effective.",
    },
    {
      img: ChatTranslation,
      title: 'Chat Translation',
      description: 'Real-time translation lets you connect with people across the globe, regardless of language barriers.',
    },
    {
      img: Encryption,
      title: 'End-to-End Encryption',
      description: 'Your conversations are fully encrypted, keeping your personal moments private and secure.',
    },
  ];

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

  return (
    <div id="homepage" className="space-y-10">
      <header className="flex my-5 justify-between">
        <div>
          <Image width={52} height={40} src={SyncLogo} alt="Sync Logo" className="drop-shadow-2xl" />
          <h1 className="sr-only">Sync</h1>
        </div>
        <nav className="hidden w-8/12 justify-evenly items-center md:flex space-x-4">
          {headerNav.map((nav, index) => (
            <Link
              href={nav.link}
              key={index}
              className="border-solid border-2 center w-24 h-10 p-4 rounded-xl bg-white hover:bg-slate-100 border-black"
              style={{
                color: 'black'
              }}
            >
              {nav.name}
            </Link>
          ))}
        </nav>
        <Link href={`${isAuthenticated ? "/auth/logout" : "/auth/login"}`} className="bg-color w-28 rounded-lg p-2 text-center text-white hidden md:block" style={{
          color: "white"
        }}>{isAuthenticated ? 'Logout' : 'Login'}</Link>
        {/* Menu Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 hover:text-black" />
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b absolute left-0 w-full">
          <nav className="flex flex-col items-center space-y-3 py-3">
            {headerNav.map((nav, index) => (
              <Link
                href={nav.link}
                key={index}
                className="text-black border-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 border-black"
              >
                {nav.name}
              </Link>
            ))}
            <Link
              href={`${isAuthenticated ? "/auth/logout" : "/auth/login"}`}
              className="bg-black px-4 py-2 rounded-lg"
              style={{
                color: "white"
              }}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </Link>
          </nav>
        </div>
      )}
      <main className="space-y-16">
        <section className=" px-4 w-full lg:w-1/2 mt-16 mb-24 text-center lg:text-left">
          <div className="text-4xl md:text-6xl lg:text-8xl font-serif md:text-slate-800 text-shadow">Synchronize for work, play, and Everything in between</div>
          <div className="my-3 text-slate-600">A single platform for all your communication need</div>
          <Link href={isAuthenticated ? "/lobby/initiate" : "/auth/signup"} className="block bg-color mx-auto lg:mx-0 w-40 rounded-ss-2xl rounded-ee-2xl p-3 text-md font-medium font-serif text-center" style={{
          color: "white"
        }}>{isAuthenticated ? 'Start Meeting' : 'Get Started'}</Link>
        </section>
        <section>
          <h2 className="text-center text-slate-800 mb-16 text-4xl md:text-6xl lg:text-8xl font-serif" id="features">Features</h2>
          <div className="flex flex-wrap justify-evenly gap-16">
            {features.map((feature, index) => <div className="w-96 space-y-2 bg-white p-2 rounded-2xl hover:scale-105 transition-transform" key={index}>
              <Image src={feature.img} alt={feature.title} className="h-auto" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <div>{feature.description}</div>
            </div>)}
          </div>
        </section>
      </main>

      <footer className="absolute w-full right-0 space-y-5">
        <div className="grid grid-cols-3 p-10 bg-color w-11/12 m-auto rounded-xl font-serif text-white" style={{
          backgroundColor: '#0a1214b7'
        }}>
          <section className="space-y-2">
            <Image src={SyncLogo} alt="Sync Logo" className="w-14 md:m-0 m-auto h-14 drop-shadow-2xl" />
            <div className="text-xl font-bold">Video Chat, Reimagined.</div>
            <div className="text-sm">{`Sync isn’t just another video chat app; it's a space for real connection, seamless interaction, and trusted privacy. Whether you’re catching up with friends, joining study groups, or hosting virtual meetups, Sync brings everyone together effortlessly.`}</div>
            <div>
              Follow Us:
              <div className="flex mt-2 space-x-4">
                <Link href="https://github.com/GoldenThrust" className="w-10 block p-3 bg-color rounded-full center" ><Image src={GithubIcon} alt="Github Icon" /></Link>
                <Link href="https://www.linkedin.com/in/olajide-adeniji/" className="w-10 block p-3 bg-color rounded-full center" ><Image src={LinkedInIcon} alt="LinkedIn Icon" /></Link>
                <Link href="https://x.com/Goldenthrust3" className="w-10 block p-3 bg-color rounded-full center" ><Image src={TwitterIcon} alt="Twitter Icon" /></Link>
              </div>
            </div>
          </section>
          <section className="space-y-5">
            <div className="text-xl font-bold">Contact Us:</div>
            <form className="space-y-3" onSubmit={messageSubmit(onMessageSubmit)}>
              <FormField data={contactUs} hook={messageFormHook} className="md:w-3/4 w-full" />
              <Button value="Send" className="md:w-3/4 w-full" />
            </form>
          </section>
          <section className="space-y-5">
            <div className="space-y-2">
              <div className="text-xl font-bold">NEWSLETTER</div>
              <OneFormField name="email" placeholder="Enter Your Email" FormIcon={<Mail />} SubmitIcon={<Send />} type="email" OnSubmit={onNewsLetterSubmit} className="md:w-3/4 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4" >
              <Link href="#" >About</Link>
              <Link href="#" >Pricing</Link>
              <Link href="#" >Support</Link>
              <Link href="#features" >Features</Link>
              <Link href="#" >Privacy Policy</Link>
              <Link href="#" >Terms and Conditions</Link>
            </div>
          </section>
        </div>
        <div className="bg-color m-0 h-14 text-white text-center p-3 mt-10">Copyright © 2024 Sync. All Right Reserved</div>
      </footer>
    </div>
  );
}
