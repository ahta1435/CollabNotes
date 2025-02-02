import { Copy, Plus, Share, Pen} from "lucide-react"

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
  setTitleName
}) {

  const [title,setTitle] = useState("");
  const history = useHistory();

  const userData = useContext(UserContext);
  
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
    setUserNotes([...userNotes,{title:title,notesId:docId,url:`${docId}/${userData?.userData?._id}/${title}`}]);
    history.push(`/dashboard/notes/${docId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
               {!shareLink && !addDocument && <Plus className="size-4" />}
               {shareLink && <Share className="size-4"/>}
               {addDocument && <Pen className="size-4"/>}
              </div>
              <div className="font-medium text-muted-foreground">{shareLink ? "Share" : !addDocument ? "Add Collaborator" : "Create New"}</div>
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
      {!shareLink && !addDocument && <DialogContent className="sm:max-w-md">
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
            <Button type="button" variant="secondary">
              Send Invite
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
