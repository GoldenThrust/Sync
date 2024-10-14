import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function SearchBar() {
    return (
        <>

            <div className="hidden sm:flex flex-row w-4/5 bg-zinc-800 border-cyan-800 border-2 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="search" className="bg-transparent border-s-2 border-s-cyan-800 ms-4 w-full rounded-e-full outline-none px-2" />
            </div>
            <Popover>
                <PopoverTrigger className="flex place-items-center sm:hidden flex-row gap-2 w-2/3" asChild>
                    <button className="text-xs text-white-600 
                    hover:text-cyan-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent>
                    <input type="search" className="bg-transparent border-2 ms-2 w-full outline-none px-2 placeholder:text-cyan-300 rounded-xl text-xs p-2" placeholder="Search...." />
                </PopoverContent>
            </Popover>
        </>
    )
}