import { AppSidebar } from "../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"
import {DialogCloseButton} from "../components/DialogCloseButton";
import { Textarea } from "../components/ui/textarea";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory
} from "react-router-dom"
import { UserContext } from '../Context';
import { useState, useEffect, useMemo, useContext } from "react";
import TextEditor from "../Editor/TextEditor";
import _ from "lodash";

function UserDashboard() {
  const [userNotes,setUserNotes] = useState([]);
  const [selectedId,setSelectedNoteBook] = useState("");
  const [titleName,setTitleName] = useState("");
  const {user} = useContext(UserContext);
  const userData = user;

  useEffect(() => {
    async function fetchData() {
        try {
            const userId = userData?.userData?._id;
            const params = {
                userId
            };
            const queryString = new URLSearchParams(params).toString();
            const jsonData = await fetch(`http://localhost:8000/notebook/notes/${queryString}`);
            const data = await jsonData.json();
            setUserNotes(data?.data);
        } catch (e) {
    
        }
    }
    fetchData();
  },[]);

  return (
    <SidebarProvider>
      <AppSidebar userNotes={userNotes} setUserNotes={setUserNotes} setSelectedNoteBook={setSelectedNoteBook} setTitleName={setTitleName}/>
     <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Title :: 
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{titleName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DialogCloseButton/>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DialogCloseButton shareLink/>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex">
                <span className="py-2">Collaborators ::</span>
                <Avatar className="mx-3 my-1 h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Switch>
            <Route path="/dashboard/notes/:id/:userId?/:title?/:isShare?">
              <TextEditor/>
            </Route>
            <Route path="/dashboard/notes" >
                <Redirect to={`/dashboard/notes/${selectedId}/${userData?.userData?._id}/${titleName}`} />
            </Route>
        </Switch>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default UserDashboard;
