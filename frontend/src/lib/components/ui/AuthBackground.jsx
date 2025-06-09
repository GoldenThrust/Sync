import PropTypes from 'prop-types'
import { Link } from 'next/link'
import Sync from '@/lib/assets/sync.svg'
export default function AuthBackground({ children }) {
    return <>
        <header className='z-10 relative'>
            <Link href="/" className="p-1"> <img src={Sync} alt="Sync Logo" className="w-14 drop-shadow-2xl"></img><div className="sr-only">Sync</div></Link>
        </header>
        <main className='absolute top-0 flex w-full'>
            <section id='bg-auth' className='hidden md:flex'></section>
            <section className='grow flex flex-col justify-center items-center h-screen'>{children}</section>
        </main>
    </>
}

AuthBackground.propTypes = {
    children: PropTypes.any,
}