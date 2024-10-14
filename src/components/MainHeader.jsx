"use client"
import SearchBar from "@/components/ui/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Headers() {
    const { data: session } = useSession();
    const [sessionData, setSessionData] = useState({
        image: "https://github.com/shadcn.png",
    })

    useEffect(() => {
        if (session?.user)
            setSessionData(session?.user)
    }, [session?.user])



    return (
        <header className="flex justify-between mx-10 my-5 max-w-screen-2xl">
            <Logo />
            <div className="flex sm:w-2/3 w-1/4 justify-between gap-3">
                <SearchBar />
                <Avatar className="border-cyan-800 border-2">
                    <AvatarImage src={sessionData.image} />
                    <AvatarFallback>LO..</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}