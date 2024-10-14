"use client"
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";


export default function GoogleButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <div className="flex gap-3">
                    <Link href='/dashboard' className="p-1 w-40 flex place-items-center justify-center border-2 border-cyan-600 border-solid  shadow-lg bg-cyan-900 text-sm  text-cyan-50 ">Dashboard</Link>
                    <button style={{ backgroundColor: 'rgb(66, 133, 244)' }} onClick={() => signOut("google")} className="p-1 w-40 flex place-items-center gap-1 text-sm text-cyan-50">
                        <div className="bg-white p-1 flex justify-center me-5">
                            <Image src="/google-logo.png" alt="Google Logo" width={20} height={20} />
                        </div>
                        Sign Out
                    </button>
                </div>
            </>
        )
    }


    return (
        <button style={{ backgroundColor: 'rgb(66, 133, 244)' }} onClick={() => signIn("google")} className="p-1 w-40 flex place-items-center rounded-sm gap-1 text-xs text-cyan-50">
            <div className="bg-white p-1 flex justify-center">
                <Image src="/google-logo.png" alt="Google Logo" width={20} height={20} />
            </div>
            Sign in with Google
        </button>
    )
}
