import PropTypes from "prop-types"
import Sync from "@/lib/assets/sync.svg";
import Image from "next/image";

export default function Head({ className }) {
    return <header className={className}>
        <div className="flex justify-center items-center ms-3"> <Image src={Sync} alt="Sync Logo" className="w-14 drop-shadow-2xl"></Image><div className="sr-only">Sync</div></div>
    </header>
}

Head.propTypes = {
    className: PropTypes.string
}