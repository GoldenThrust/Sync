import { Link } from "react-router-dom";

export default function Error404() {
    return <div id="lobby">
        <h1 className="text-4xl font-serif">Error 404: Page Not Found</h1>
        <Link href="/" className="text-2xl">Go back to home page</Link>
    </div>
}