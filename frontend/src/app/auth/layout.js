import Sync from '@/lib/assets/sync.svg'
import Image from 'next/image'
import Link from 'next/link'
export default function AuthBackground({ children }) {
    return <>
        <header className='z-10 relative'>
            <Link href="/" className="p-1"> <Image src={Sync} alt="Sync Logo" className="w-14 drop-shadow-2xl"></Image><div className="sr-only">Sync</div></Link>
        </header>
        <main className='absolute top-0 flex w-full'>
            <section id='bg-auth' className='hidden md:flex'></section>
            <section className='grow flex flex-col justify-center items-center h-screen'>{children}</section>
        </main>
    </>
}