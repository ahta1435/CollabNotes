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
import { useState, useEffect, useMemo, useContext } from "react";
import TextEditor from "../Editor/TextEditor";
import _ from "lodash";
import Loader from "../Loader/Loader";


function UserDashboard() {
  const [userNotes,setUserNotes] = useState([]);
  const history = useHistory();
  const [showDocumentDeleted,setShowDocumentDeleted] = useState(false);
  const [selectedId,setSelectedNoteBook] = useState("");
  const [titleName,setTitleName] = useState("");
  const [contributors,setContributors] = useState([]);
  const [collaborators,setCollaborators] = useState([]);
  const [sharedNoteBooks,setSharedNoteBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLoader,setShowLoader] = useState(false);
  const userData = user?.userData;

  async function fetchData() {
    try {
      setShowLoader(true);
      const loc = history.location.pathname.split("/");
      const userId = userData?._id;
      const params = {userId};
      const queryString = new URLSearchParams(params).toString();
      const jsonData = await fetch(`https://collabnotes-uj7x.onrender.com/notebook/notes/${queryString}`);
      const data = await jsonData.json();

      const contributorPrams = {
        notesId : loc[3]
      };

      const contributorQuery = new URLSearchParams(contributorPrams).toString();
      const getContributors = await fetch(`https://collabnotes-uj7x.onrender.com/notebook/contributors/${contributorQuery}`);
      const response = await getContributors.json();
      
      setContributors(response.contributors[0]?.contributers || []);
      setUserNotes(data?.data?.data);
      setSharedNoteBooks(data?.data?.sharedNotes);
      setShowLoader(false);
      
    } catch (e) {
      setShowLoader(false);
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    if (contributors.length == 0) {
      setCollaborators([]);
    }
    async function fetchData() {
      try {
        setShowLoader(true);
        const userIds = contributors;
        const dataObj = {userIds};
        const jsonData = await fetch(`https://collabnotes-uj7x.onrender.com/user/getUsers`, {method : "POST",
          headers : {
              'Content-type' : "application/json"
          },
          body : JSON.stringify(dataObj)});
        const data = await jsonData.json();
        setCollaborators(data?.data);
        setShowLoader(false);
      } catch (e) {
        setShowLoader(false);
      }
    }
    fetchData();
  },[contributors]);

  const isCurrentUserIsAlsoCollaborator = () => {
    const userId = userData?._id;
    const loc = history.location.pathname.split("/");
    const currentDocOwnerId = loc[4];
    return userId === currentDocOwnerId;
  }

  return (
    <SidebarProvider>
      {showLoader && <Loader/>}
      <AppSidebar userNotes={userNotes} setUserNotes={setUserNotes} setSelectedNoteBook={setSelectedNoteBook} setTitleName={setTitleName} key={userNotes.length} setContributors={setContributors} setSharedNoteBooks={setSharedNoteBooks} sharedNoteBooks={sharedNoteBooks} selectedId={selectedId} setShowLoader={setShowLoader}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Title
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{titleName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
            {isCurrentUserIsAlsoCollaborator() && <DialogCloseButton addGroup setTitleName={setTitleName} setUserNotes={setUserNotes} setSelectedNoteBook={setSelectedNoteBook} setSharedNoteBooks={setSharedNoteBooks} setShowLoader={setShowLoader}/>}
            <Separator orientation="vertical" className="mr-2 h-4" />
            {isCurrentUserIsAlsoCollaborator() && <DialogCloseButton inviteContributor/>}
            <Separator orientation="vertical" className="mr-2 h-4" />
            {isCurrentUserIsAlsoCollaborator() && <DialogCloseButton shareLink/>}
            <Separator orientation="vertical" className="mr-2 h-4" />
            {!_.isEmpty(collaborators) && <div className="flex">
              <span className="py-2">Collaborators ::</span>
              {collaborators?.map((item)=>(
                <Avatar className="mx-3 my-1 h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{item.firstName.slice(0,2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Switch>
            <Route path="/dashboard/notes/:id/:userId?/:title?/:isShare?">
              <TextEditor setContributors={setContributors} setShowDocumentDeleted={setShowDocumentDeleted}/>
            </Route>
            <Route path="/dashboard/notes" >
              <Redirect to={`/dashboard/notes/${selectedId}/${userData?._id}/${titleName}`} />
            </Route>
          </Switch>
        </div>
        {showDocumentDeleted && <DialogCloseButton inviteContributor/>}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default UserDashboard;
