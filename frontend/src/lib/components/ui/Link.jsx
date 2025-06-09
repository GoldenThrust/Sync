import PropTypes from "prop-types";
import { apiUrl } from "../../utils/constants";
import NextLink from "next/link";

export default function Link({ href, className, children }) {
    // Prefix all hrefs with apiUrl
    const finalHref = href.startsWith('http') ? href : `${apiUrl}${href}`;
    
    return <NextLink href={finalHref} className={className}>{children}</NextLink>
}

Link.propTypes = {
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node
}