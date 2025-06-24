import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SyncLogo from '../assets/sync.svg';
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

/**
 * Error page component that displays error information from URL query parameters
 * Supports error message, error code, and a redirect link
 */
export default function ErrorPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorInfo, setErrorInfo] = useState({
        message: "An unexpected error occurred",
        code: "500",
        redirectPath: "/",
        redirectText: "Home Page"
    });

    useEffect(() => {
        // Parse query parameters for error information
        const message = searchParams.get("message");
        const code = searchParams.get("code");
        const redirectPath = searchParams.get("redirect");
        const redirectText = searchParams.get("redirectText");

        // Update state with any parameters that were provided
        setErrorInfo(prev => ({
            ...prev,
            message: message || prev.message,
            code: code || prev.code,
            redirectPath: redirectPath || prev.redirectPath,
            redirectText: redirectText || prev.redirectText
        }));
    }, [searchParams]);

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
                <div className="flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h1 className="text-7xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">Error {errorInfo.code}</h1>
                <div className="h-0.5 w-24 bg-gradient-to-r from-white/20 to-red-400/20"></div>

                <div className="text-center text-white mb-2 text-xl">
                    {errorInfo.message}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-white"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <Link
                        to={errorInfo.redirectPath}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg text-white"
                    >
                        <Home size={18} />
                        {errorInfo.redirectText}
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-white"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>      </div>
        </div>
    );
}