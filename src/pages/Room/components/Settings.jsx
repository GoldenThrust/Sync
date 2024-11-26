import PropTypes from "prop-types"
import Button from "../../../components/ui/form/Button"

export default function Settings({ setSettingsOpen }) {
    return <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center z-20 bg-black bg-opacity-50">
        <Button onClick={() => { setSettingsOpen(false) }} value={'OK'} />
    </div>
}

Settings.propTypes = {
    setSettingsOpen: PropTypes.func.isRequired,
}