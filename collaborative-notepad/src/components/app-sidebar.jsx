import React , {useState} from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import _ from "lodash";

function prepareData(notes,sharedNoteBooks) {
  const groups = _.map(notes, 'group');
  const uniqueGroups = _.uniq(groups);
  const data = {};
  const navMain = [];
  let sharedObj = {title : "Shared With Me", url : "#", }
  let shareditems = [];
  sharedNoteBooks.forEach( data => {
    let obj = {};
    obj["title"] = data?.title;
    obj["url"] =  `dashboard/notes/${data?._id}/${data?.userId}/${data?.title}`;
    shareditems.push(obj);
  });

  sharedObj["items"] = shareditems;
  navMain.push(sharedObj);
  uniqueGroups.forEach((groupName, index) => {
    const obj = {};
    obj["title"] = index == 0 ? groupName || "Default Group" : groupName;
    obj["url"] = "#";
    const items = [];
    const itemsData = _.filter(notes,(item) => item?.group == groupName);
    itemsData.forEach( data => {
      const obj = {};
      obj["title"] = data?.title;
      obj["url"] =  data?.url ? `dashboard/notes/${data?.url}` : `dashboard/notes/${data?._id}/${data?.userId}/${data?.title}`;
      items.push(obj);
    })
    navMain.push({...obj, items});
  });
  data["navMain"] = navMain;
  return data;
}

export function AppSidebar({
  ...props
}) {

  const notes = props?.userNotes;
  const sharedNoteBooks = props?.sharedNoteBooks;
  const data = prepareData(notes,sharedNoteBooks);
  const user = JSON.parse(localStorage.getItem("user"));
  const userData = user?.userData;

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher userNotes={props.userNotes} setUserNotes={props.setUserNotes} setSelectedNoteBook={props.setSelectedNoteBook} setTitleName={props.setTitleName}/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} userNotes={props.userNotes} setUserNotes={props.setUserNotes} setSelectedNoteBook={props.setSelectedNoteBook} setTitleName={props.setTitleName} setContributors={props.setContributors} setSharedNoteBooks={props.setSharedNoteBooks} sharedNoteBooks={props.sharedNoteBooks} selectedId={props.selectedId} setShowLoader={props.setShowLoader}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
