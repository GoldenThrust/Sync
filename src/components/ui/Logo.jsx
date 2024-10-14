import Image from "next/image"
import Link from "next/link"

export default function Logo() {
    return (
        <Link href={'/'}>
            <Image src='/logo2.svg' alt="Collaborative Document Hub Logo" width={150} height={150} priority />
        </Link>
    )
}