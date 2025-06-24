import { Link } from "react-router-dom";
import SyncLogo from '../assets/sync.svg';

import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div id="lobby" className="relative">
            <div className="flex items-center justify-center mb-6 absolute top-10 left-10">
                <img src={SyncLogo} alt="Sync Logo" className="w-14 drop-shadow-2xl drop-shadow-amber-50/50" />
                <h1 className="sr-only">Sync</h1>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 p-6 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg mx-auto shadow-2xl">
                <h1 className="text-7xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">404</h1>
                <div className="h-0.5 w-24 bg-gradient-to-r from-white/20 to-blue-400/20"></div>
                <h2 className="text-2xl font-serif text-center">Oops! The page you're looking for doesn't exist.</h2>

                <p className="text-center text-white/70 mb-4">
                    It seems you've ventured into uncharted territory. The page you're looking for might have been moved, deleted, or never existed.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-white"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg text-white"
                    >
                        <Home size={18} />
                        Home Page
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-white"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}