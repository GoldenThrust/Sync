"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Eye, EyeOff, Settings, Edit, Trash, Tags } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import Link from "next/link"
import Share from "@/components/ui/Share"

const DropdownItemGroup = ({ title, icon: Icon, children }) => (
    <DropdownMenuSub>
        <DropdownMenuSubTrigger>
            <Icon className="mr-2 h-4 w-4 text-gray-500" />
            {title}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="p-0 bg-slate-600 bg-opacity-50 shadow-lg">
            <Command>
                <CommandList>
                    <CommandGroup>{children}</CommandGroup>
                </CommandList>
            </Command>
        </DropdownMenuSubContent>
    </DropdownMenuSub>
)

// const VisibilityOptions = ({ visibility, setVisibility }) => (
//     <>
//         <CommandItem
//             value="Public"
//             onSelect={() => setVisibility("public")}
//         >
//             <Eye className="mr-2 h-4 w-4 text-green-600" />
//             Public
//         </CommandItem>
//         <CommandItem
//             value="Private"
//             onSelect={() => setVisibility("private")}
//         >
//             <EyeOff className="mr-2 h-4 w-4 text-violet-600" />
//             Private
//         </CommandItem>
//     </>
// )

const PropertiesOptions = ({ properties }) => (
    <>
        {Object.entries(properties).map(([key, value]) => (
            <CommandItem key={key} value={`${key} ${value}`}>
                <Settings className="mr-2 h-4 w-4 text-gray-500" />
                {key} {value}
            </CommandItem>
        ))}
    </>
)

const GDocumentActions = ({ docname, link, onDelete }) => (
    <>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-blue-400" >
            <Share emailBody={`To view or access the Document, simply click the link below: ${link}`} link={link} />
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="text-green-400" onClick={onUpdate}>
            <Edit className="mr-2 h-4 w-4 text-green-400" />
            Update
        </DropdownMenuItem> */}
        <DropdownMenuItem className="text-red-600" onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4 text-red-600" />
            Delete
        </DropdownMenuItem>
    </>
)

export default function Document({ docname, properties, gid, onDelete }) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState(gid)

    useEffect(() => {
        const fullURL = window.location.origin;
        setUrl(`${fullURL}/document/${gid}`)
    }, [gid]);

    return (
        <div className="flex w-full flex-col items-start justify-between rounded-xl overflow-hidden border px-4 py-3 sm:flex-row sm:items-center bg-amber-800 shadow-lg">
            <Link href={url} className="text-sm font-medium leading-none" >
                <span className="text-muted-foreground">{docname}</span>
            </Link>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-slate-600 bg-opacity-50 shadow-lg">
                    <DropdownMenuGroup>
                        {/* <DropdownItemGroup title={`Visibility: ${currentVisibility === "public" ? "Public" : "Private"}`} icon={Tags}>
                            <VisibilityOptions visibility={currentVisibility} setVisibility={setVisibility} />
                        </DropdownItemGroup> */}
                        {/* <DropdownMenuSeparator /> */}

                        <DropdownItemGroup title="Properties" icon={Settings}>
                            <PropertiesOptions properties={properties} />
                        </DropdownItemGroup>

                        <GDocumentActions docname={docname} link={url} onDelete={onDelete} />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
