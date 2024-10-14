"use client";
import FileViewer from "@/components/FileViewer";
import { ArrowBigLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function File({ params }) {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const router = useRouter(); 

    async function fetchFile() {
        try {
            const response = await fetch(`/api/documents/file?cid=${params.cid}`);

            // Check if the response is okay before trying to parse
            if (!response.ok) {
                const errorResult = await response.json();
                setError(errorResult.message || "Error fetching document.");
                return;
            }

            const result = await response.json();

            if (result.status === "Error") {
                setError(result.message);  // Use message in case of error
                return;
            }

            setData(result);
        } catch (error) {
            setError(error.message || "Unexpected error occurred.");
            console.error("Error fetching document:", error);
        }
    }

    // Ensure that the effect only runs when `params.cid` changes.
    useEffect(() => {
        if (params.cid) {
            fetchFile();
        }
    }, [params.cid]);

    // Render based on error or data
    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!data) {
        return <p>Loading...</p>;  // Display loading state
    }

    return (
        <>
            <button onClick={() => router.back()} className="flex items-center space-x-2">
                <ArrowBigLeft /> <span>Back</span>
            </button>
            <FileViewer fileUrl={`https://ipfs.io/ipfs/${params.cid}`} fileType={data.contentType} />
        </>
    );
}