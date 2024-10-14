"use client"
import { useState, useEffect } from 'react';
import DocumentList from "@/components/DocumentList";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/ui/FilesUploader";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronRight } from "lucide-react";

export default function Dashboard() {
    const [data, setData] = useState([]);

    async function fetchData() {
        try {
            const response = await fetch('/api/documents/group');
            const result = await response.json();
            setData(result.groups);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    }

    async function onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const groupName = formData.get('name');

        try {
            const response = await fetch('/api/documents/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: groupName,
            });

            if (response.ok) {
                fetchData();
            } else {
                console.error("Failed to create Document");
            }
        } catch (error) {
            console.error("Error creating Document:", error);
        }
    }

    const onDelete = (gid) => async () => {
        try {
            const response = await fetch('api/documents/group', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: gid,
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
        fetchData();
    }, []);

    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 gap-5 mx-5">
            <FileUploader />
            <div>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full rounded-xl bg-slate-500">Create Document</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-slate-500">
                            <form onSubmit={onSubmit} className="flex w-full max-w-sm items-center space-x-2">
                                <Input type="text" placeholder="name" id='name' name='name' className='bg-slate-800' />
                                <Button variant="outline" size="icon" type="submit" className='bg-emerald-400'>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </form>
                        </PopoverContent>
                    </Popover>
                </div>
                <h2 className="text-xl font-bold text-amber-600">Documents</h2>
                <DocumentList data={data} onDelete={onDelete} />
            </div>
        </main>
    );
}
