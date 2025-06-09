import PropTypes from "prop-types"

export default function Button({ value, className, type = 'submit', onClick = null }) {
    if (type === 'submit') {
        return <input type={type} value={value} onClick={onClick} className={`button-style rounded-lg p-3 text-sm outline-none ${className}`} />
    }

    return <button type={type} onClick={onClick} className={`button-style rounded-lg p-3 text-sm outline-none ${className}`}>
        {value}
    </button>
}

Button.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    value: PropTypes.any,
}