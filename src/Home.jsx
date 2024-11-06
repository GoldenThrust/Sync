import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function Home() {
    const navigate = useNavigate();

    const HandClick = (path) => () => {
        const id = uuid();
        navigate(`${path}${id}`);
    };

    return <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex flex-col gap-10">
        <button onClick={HandClick('/')} className="bg-gray-800 w-96 aspect-video rounded-lg">Room 1</button>
        <button onClick={HandClick(`/test/`)} className="bg-gray-800 w-96 aspect-video rounded-lg">Room 2</button>
    </div>
}