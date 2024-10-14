"use client"
import { useEffect, useState } from "react"

import { Edit, Eye, EyeOff, Settings, Tag, Tags, Trash, Type, View } from "lucide-react"
import Share from "@/components/ui/Share"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import Link from "next/link";


const VisibilityOptions = ({ visibility, setVisibility, Icon }) => (
  <>
    <ContextMenuSub>
      <ContextMenuSubTrigger inset>
        <Icon className="mr-2 h-4 w-4 text-gray-500" />
        {`Visibility: ${visibility === "public" ? "Public" : "Private"}`}</ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem
          value="Public"
          onSelect={() => setVisibility("public")}>
          <Eye className="mr-2 h-4 w-4 text-green-600" />
          Public
        </ContextMenuItem>
        <ContextMenuItem value="Private"
          onSelect={() => setVisibility("private")}
        >
          <EyeOff className="mr-2 h-4 w-4 text-violet-500" />
          Private
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </>
)


const VisibilityType = ({ visibility_type, setvisibility_type, Icon }) => (
  <>
    <ContextMenuSub>
      <ContextMenuSubTrigger inset>
        <Icon className="mr-2 h-4 w-4 text-gray-500" />
        {`Visibility Type: ${visibility_type === "edit" ? "Edit" : "View"}`}</ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem
          value="Edit"
          onSelect={() => setvisibility_type("Edit")}>
          <Edit className="mr-2 h-4 w-4 text-green-600" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem value="View"
          onSelect={() => setvisibility_type("View")}
        >
          <View className="mr-2 h-4 w-4 text-violet-500" />
          VIew
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </>
)


export function File({ filename, properties, visibility, onDelete, cid, visibility_type, groups, owner }) {
  const [currentVisibility, setVisibility] = useState(visibility)
  const [currentVisibility_type, setVisibility_type] = useState(visibility_type)
  const [url, setUrl] = useState(cid)

  useEffect(() => {
    const fullURL = window.location.href;
    setUrl(`${fullURL}/${cid}`)
  }, [cid]);

  return (
    <Link href={url}>
      <ContextMenu className="">
        <ContextMenuTrigger className="flex h-[80px] w-[150px] items-center justify-center rounded-md border border-dashed text-xs text-wrap">
          {filename}
        </ContextMenuTrigger>

        <ContextMenuContent className="w-64">

          <ContextMenuItem inset>
            <Share emailBody={`To view or access the file, simply click the link below: ` + url}  link={url} />
          </ContextMenuItem>

          <ContextMenuSub>
            <ContextMenuSubTrigger inset><Settings className="mr-2 h-4 w-4 text-gray-500" />Properties</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {Object.entries(properties).map(([key, value]) => (
                <ContextMenuItem key={key}>
                  <Settings className="mr-2 h-4 w-4 text-gray-500" />
                  {key}: {value}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          {
            owner && (<>
              <VisibilityOptions visibility={currentVisibility} setVisibility={setVisibility} Icon={Tags} />

              <VisibilityType visibility_type={currentVisibility_type} setvisibility_type={setVisibility_type} Icon={Tag} />
              <ContextMenuSeparator />

              <ContextMenuItem inset className="text-red-600" onSelect={onDelete}>
                <Trash className="mr-2 h-4 w-4 text-red-600" />
                Delete
              </ContextMenuItem>
            </>)
          }
        </ContextMenuContent>
      </ContextMenu>
    </Link>
  );
}
