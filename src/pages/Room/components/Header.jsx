import PropTypes from "prop-types"
import Sync from "../../../assets/sync.svg";

export default function Header({ className }) {
    return <header className={className}>
        <div className="flex justify-center items-center ms-3"> <img src={Sync} alt="Sync Logo" className="w-14 drop-shadow-2xl drop-shadow-amber-50/50"></img><div className="sr-only">Sync</div></div>
        <div className="flex justify-center items-center flex-col m-auto"><span className="font-mono font-bold text-lg">Meeting Topic</span><span className="text-xs font-extralight">Session Name</span></div>
    </header>
}

Header.propTypes = {
    className: PropTypes.string
}