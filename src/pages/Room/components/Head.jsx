import PropTypes from "prop-types"
import Sync from "../../../assets/sync.svg";

export default function Head({ className }) {
    return <header className={className}>
        <div className="flex justify-center items-center ms-3"> <img src={Sync} alt="Sync Logo" className="w-14 drop-shadow-2xl drop-shadow-amber-50/50 "></img><div className="sr-only">Sync</div></div>
    </header>
}

Head.propTypes = {
    className: PropTypes.string
}