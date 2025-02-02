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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    }
  ]
}

function prepareData(notes) {
  const groups = _.map(notes, 'group');
  const uniqueGroups = _.uniq(groups);
  const data = {};
  const navMain = [];
  uniqueGroups.forEach((groupName, index) => {
    const obj = {};
    obj["title"] = index == 0 ? groupName || "Default Group" : groupName;
    obj["url"] = "#";
    const items = [];
    const itemsData = _.filter(notes,(item) => item?.group == groupName);
    itemsData.forEach( data => {
      console.log(data?.url+ "::::end");
      const obj = {};
      obj["title"] = data?.title;
      obj["url"] = data?.url || `dashboard/notes/${data?._id}/${data?.userId}/${data?.title}`;
      items.push(obj);
    })
    navMain.push({...obj, items});
  });
  data["navMain"] = navMain
  return data;
}

export function AppSidebar({
  ...props
}) {

  const notes = props?.userNotes;
  const data = prepareData(notes);
  console.log(data);
  

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher userNotes={props.userNotes} setUserNotes={props.setUserNotes} setSelectedNoteBook={props.setSelectedNoteBook} setTitleName={props.setTitleName}/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
