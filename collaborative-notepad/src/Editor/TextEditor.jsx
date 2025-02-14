import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams, useHistory } from "react-router-dom"
import "./editor.css";

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
]

export default function TextEditor({setContributors,setLoadOnShareDeletion}) {
  const {id :documentId,userId,title,isShare} = useParams();
  const history = useHistory();
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.userData?._id;
  const ref = useRef(null);
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
   
  // delete all the changes which has to be synced with the editor if the document is changed
  useEffect(()=>{
    clearInterval(ref.current);
  },[documentId]);
  
  useEffect(() => {
    const s = io("https://collabnotes-uj7x.onrender.com")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return
    socket.on('contributors-updated', (updatedContributors) => {
      setContributors(updatedContributors);
    });
    return () => {
      socket.off('contributors-updated');
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return
    socket.on('refresh', () => {
      setLoadOnShareDeletion(true);
      history.push("/dashboard");
    });
    return () => {
      socket.off('refresh');
      setLoadOnShareDeletion(false);
    };
  }, [socket]);

  // first time loading the document
  useEffect(() => {
    if (socket == null || quill == null) return
    socket.emit("get-document", documentId,userId,title,loggedInUserId);

    socket.once("load-document", document => {
      quill.setContents(document);
      quill.enable();
    });
  }, [socket, quill, documentId,title]);

  useEffect(() => {
    if (socket == null || quill == null) return

    ref.current = setInterval(() => {
      const delta = quill.getContents();
      const plainTextDelta = delta.ops.map(op => {
        return {
          ...op,
          // removing the extra arrtibutes
          attributes: {}
        };
      });
      socket.emit("save-document", plainTextDelta,documentId,loggedInUserId,userId)
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(ref.current)
    }
  }, [socket, quill,documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      const plainTextDelta = delta.ops.map(op => {
        return {
          ...op,
          // removing the extra arrtibutes
          attributes: {}
        };
      });
      quill.updateContents(plainTextDelta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
  
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;
    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, []);


  return <div className="container" ref={wrapperRef}></div>
}