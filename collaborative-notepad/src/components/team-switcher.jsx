import React , {useContext} from "react"
import {Pen} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserContext } from '../Context';
import { Button } from "./ui/button";
import { v4 as uuidV4 } from "uuid";
import { useHistory, useParams } from 'react-router-dom';
import { DialogCloseButton } from "./DialogCloseButton";
export function TeamSwitcher({
  userNotes,
  setUserNotes,
  setSelectedNoteBook,
  setTitleName
}) {
  const { isMobile } = useSidebar();
  const userData = useContext(UserContext);

  const createProps = {
    userNotes,
    setUserNotes,
    setSelectedNoteBook,
    setTitleName
  };

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
         <SidebarMenuButton
           size="lg"
           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
           <div
             className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
           </div>
           <div className="grid flex-1 text-left text-sm leading-tight">
             <span className="truncate font-semibold">
               {userData?.userData?.firstName}
             </span>
             <span className="truncate text-xs">{userData?.userData?.email}</span>
           </div>
           <DialogCloseButton addDocument {...createProps}/>
         </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
