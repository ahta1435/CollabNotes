import { Copy, Plus, Share, Pen, Trash2} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserContext } from '../Context';
import { v4 as uuidV4 } from "uuid";
import { useHistory, useParams } from 'react-router-dom';
import { useState,useContext } from "react"

export function DialogCloseButton({
  shareLink,
  addDocument,
  userNotes,
  setUserNotes,
  setSelectedNoteBook,
  setTitleName,
  deleteDocument,
  deleteId,
  inviteContributor,
  deleteTitleName,
  addGroup,
  setSharedNoteBooks
}) {

  const [title,setTitle] = useState("");
  const [groupName,setGroupName] = useState("");
  const history = useHistory();

  const userData = JSON.parse(localStorage.getItem("user"));
  
  const handleEmailChange = () => {};
  const handleTitleChange = (event) => {
    const title = event.target.value;
    setTitle(title);
  }

  const generateDocLink = () => {
    const loc = history.location.pathname.split("/");
    let defaultValue = `http://localhost:5173/dashboard/notes/${loc[3]}/share`;
    return defaultValue;
  }

  const handleTitleSubmit = () => {
    const docId = uuidV4();
    setSelectedNoteBook(docId);
    setTitleName(title);
    setUserNotes([...userNotes,{title:title,notesId:docId,url:`${docId}/${userData?.userData?._id}/${title}`,group: "Un-Grouped"}]);
    history.push(`/dashboard/notes/${docId}/${userData?.userData?._id}/${title}`);
  };

  const getText = () => {
    if (shareLink) return "Share";
    if (inviteContributor) return "Add Collaborator";
    if (addDocument) return "Create New";
    if (addGroup) return "Move to a Group"
  }

  const handleGroupNameInput = (e) => {
    setGroupName(e.target.value)
  }

  const handleAddGroup = async () => {
    const loc = history.location.pathname.split("/");
    const dataObj = {
      group : groupName,
      id : loc[3]
    }
    const userParams = {
      userId : userData?.userData?._id
    };
    const userQueryString = new URLSearchParams(userParams).toString();
    const fetcher = async () => await fetch(`https://collab-notes-5lcc.vercel.app/api/notebook/notes/update`,{method : "POST",headers : {'Content-type' : "application/json"},body : JSON.stringify(dataObj) ,mode: 'no-cors'});
    const getAllDataAfterDelete = async () => await fetch(`https://collab-notes-5lcc.vercel.app/api/notebook/notes/${userQueryString}`,{mode: 'no-cors'});
    fetcher().then(async (res) => {
      try {
        const f = await res.json();
        const resp = await getAllDataAfterDelete();
        const data = await resp.json();
        const usersList = data?.data?.data;
        const docId = usersList[0]?._id;
        const title = usersList[0]?.title;
        setUserNotes(usersList);
        setSharedNoteBooks(data?.data?.sharedNotes);
        setSelectedNoteBook(docId);
        setTitleName(title);
        history.push(`/dashboard/notes/${docId}/${userData?.userData?._id}/${title}`);
      } catch (err) {
        console.log(err);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleDelete = async () => {
    const params = {
      notesId: deleteId
    };
    const userParams = {
      userId : userData?.userData?._id
    };
    const queryString = new URLSearchParams(params).toString();
    const userQueryString = new URLSearchParams(userParams).toString();
    const deleteFetcher = async () => await fetch(`https://collab-notes-5lcc.vercel.app/api/notebook/notes/${queryString}`,{method : "DELETE",mode: 'no-cors'});
    const getAllDataAfterDelete = async () => await fetch(`https://collab-notes-5lcc.vercel.app/api/notebook/notes/${userQueryString}`,{mode: 'no-cors'});
    deleteFetcher().then( async (res) => {
      try {
        const k = await res.json();
        const resp = await getAllDataAfterDelete();
        const data = await resp.json();
        const usersList = data?.data?.data || [];
        const docId = usersList[0]?._id || "";
        const title = usersList[0]?.title || "";
        setUserNotes(usersList);
        setSelectedNoteBook(docId);
        setSharedNoteBooks(data?.data?.sharedNotes);
        setTitleName(title);
        if (!docId) {
          history.push(`/dashboard`);
        } else {
          history.push(`/dashboard/notes/${docId}/${userData?.userData?._id}/${title}`);
        }
      } catch (error) {

      }
    }).catch(error => {

    });
  }

  const handleEmailInvite = () => {
    // const { to, subject, message } = req.body;
    const loc = history.location.pathname.split("/");
    const mailData = {
      to : "haqueahtashamul@gmail.com",
      subject : `Inviting to Collaborate on Note Book Named - ${loc[5]}`,
      message: `<h3>Please Find the Link to Join the Note <a href=${window.location.origin}${history.location.pathname}/shared>Path to App</a></h3>`
    }
    const fetcher = async () => await fetch(`https://collab-notes-5lcc.vercel.app/api/mail/send-email`,{method : "POST",headers : {'Content-type' : "application/json"},body : JSON.stringify(mailData),mode: 'no-cors'});
    fetcher().then(async (data) => {
      try {
        const res = data.json();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
               {(inviteContributor || addGroup) && <Plus className="size-4" />}
               {shareLink && <Share className="size-4"/>}
               {addDocument && <Pen className="size-4"/>}
               {deleteDocument && <Trash2 className="size-4"/>}
              </div>
              <div className="font-medium text-muted-foreground">{getText()}</div>
        </Button>
      </DialogTrigger>
      {shareLink && <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={generateDocLink()}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>}

      {addGroup && <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Current NoteBook To A Group</DialogTitle>
          <DialogDescription>
            Upon changing the group your notes will be visible in that Group only
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Add Group Name
            </Label>
             <Input type="text" id="group" placeholder="Add Group Name" onChange={handleGroupNameInput}/>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleAddGroup}>
              Move
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>}

      {inviteContributor && <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Contibutor</DialogTitle>
          <DialogDescription>
            Invite People to contribute
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              email
            </Label>
             <Input type="text" id="email" placeholder="email" onChange={handleEmailChange}/>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleEmailInvite}>
              Send Invite
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>}

      {deleteDocument && <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete NoteBook</DialogTitle>
          <DialogDescription>
            Are you Sure You want to delete?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            The Following NoteBook Will be deleted
            <DialogTitle>{deleteTitleName}</DialogTitle>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>}

      {addDocument && <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Title</DialogTitle>
          <DialogDescription>
            Add Title To the NoteBook
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Title
            </Label>
             <Input type="text" id="title" placeholder="note title" onChange={handleTitleChange}/>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleTitleSubmit}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>}
    </Dialog>
  )
}
