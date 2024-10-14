"use client"
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import Headers from "@/components/MainHeader";
import FileList from "@/components/FileList";
import { useState, useEffect } from "react";

export default function Document({ params }) {
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);

    async function fetchGroup() {
        try {
            const response = await fetch(`/api/documents/group`);
            const result = await response.json();
            setGroups(result.groups);
            fetchData();
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    }

    async function fetchData() {
        try {
            const response = await fetch(`/api/documents/files?gid=${params.gid}`);
            const result = await response.json();
            setData(result.documents);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    }


    const onDelete = (cid) => async () => {
        try {
            const response = await fetch('api/documents/files', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: cid,
            })

            if (response.ok) {
                fetchData();
            } else {
                console.error("Failed to Delete Document");
            }
        } catch (error) {
            console.error("Error creating Document:", error);
        }
    }

    useEffect(() => {
        fetchGroup();
    }, []);


    return (
        <>
            <Headers />
            <main className="space-y-3">
                <Link href={'/dashboard'} className="flex place-items-center gap-1">
                    <ArrowBigLeft /> <h2 className="text-xl font-bold text-amber-600">Documents</h2>
                </Link>

                <div>
                    <FileList data={data} groups={groups} onDelete={onDelete} />
                </div>
            </main></>

    );
}