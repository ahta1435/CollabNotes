"use client"

import { ChevronRight, Trash2 } from "lucide-react";
import { useHistory } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DialogCloseButton } from "./DialogCloseButton";
import { useState } from "react";

export function NavMain({
  items,
  setTitleName,
  userNotes,
  setUserNotes,
  setSelectedNoteBook,
  setContributors,
  setSharedNoteBooks,
  sharedNoteBooks,
  selectedId,
  setShowLoader
}) {

  const [showDeleteConfimation,setShowDeleteConfirmation] = useState(false);
  const history = useHistory();
  const handleClick = async (subItem) => {
    try {
      const currLoc = subItem?.url.split("/");
      const contributorPrams = {
        notesId : currLoc[2]
      };
      if (selectedId == currLoc[2]) {
        return;
      }
      setShowLoader(true);
    
      const contributorQuery = new URLSearchParams(contributorPrams).toString();
      const getContributors = await fetch(`https://collabnotes-uj7x.onrender.com/notebook/contributors/${contributorQuery}`);
      const response = await getContributors.json();
      setContributors(response.contributors[0]?.contributers || []);
      setTitleName(currLoc[4]);
      setShowLoader(false);
      history.push(`/${subItem?.url}`);
    } catch(err) {
      setShowLoader(false);
      console.log(err);
    }
   
  }


  const isCurrentUserIsAlsoCollaborator = (subItem) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.userData?._id;
    const loc = subItem?.url.split("/");
    const currentDocOwnerId = loc[3];
    return userId === currentDocOwnerId;
  }
  const deletePopUpProps = {
    userNotes,
    setUserNotes,
    setSelectedNoteBook,
    setTitleName,
    setSharedNoteBooks,
    sharedNoteBooks,
    setShowLoader
  }

  const isSelected = (currentUrl) => {
    const loc = history.location.pathname.split("/");
    const currLoc = currentUrl.split("/");
    return loc[3] == currLoc[2];
  }

  const getDeleteId = (subItem) => {
    const docSplit = subItem?.url.split("/");
    return docSplit[2];
  }
  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title} className={`${isSelected(subItem?.url) ? 'bg-gray-300' : ''} rounded-md flex items-center justify-between`}>
                      <SidebarMenuSubButton asChild>
                        <>
                          <div onClick={()=>handleClick(subItem)} className="cursor-pointer mx-6">
                            <span>{subItem.title}</span>
                          </div>
                          {isCurrentUserIsAlsoCollaborator(subItem) && <DialogCloseButton deleteDocument deleteId={getDeleteId(subItem)} deleteTitleName={subItem.title} {...deletePopUpProps}/>}
                        </>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
