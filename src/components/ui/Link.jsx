import PropTypes from "prop-types";
import { baseUrl } from "../../utils/constant";

export default function Link({ href, className, children }) {
    return <a href={`${baseUrl}/api${href}`} className={className}>{children}</a>
}

Link.propTypes = {
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.any
}