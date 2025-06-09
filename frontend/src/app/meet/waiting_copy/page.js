import Head from "../../../lib/components/ui/meet/Head";
import LobbyClient from "./LobbyClient";
import Button from "../../../lib/components/ui/form/Button";
import Link from "../../../lib/components/ui/Link";

export default function Lobby() {
    const id = "mdfjgje";

    return (
        <div id="lobby">
            <Head className="absolute top-3 left-1" />
            <LobbyClient id={id} Link={<Link href={`/lobby/initiate/${id}`} className="w-4/5 md:w-1/3 font-bold"><Button value="Join Chat" className="w-full font-bold" /></Link>} />
        </div>
    );
}
