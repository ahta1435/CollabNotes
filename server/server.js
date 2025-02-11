const http = require("http");
const app = require('./App');
const NoteBook = require('./Schemas/notesSchema');
require('dotenv').config();
//port at which the project shld run
const port = process.env.port || 8000;

const server = http.createServer(app);

const io = require('socket.io')(server,{
    cors : {
      origin: "*",
      methods: ["GET", "POST"],
    }
});

server.listen(port);
io.on("connection", socket => {
  socket.on("get-document", async (documentId,userId,title,loggedInUserId) => {
    try {
      const document = await findOrCreateDocument(documentId,userId,title,loggedInUserId);
      if (!document) {
          return;
      }
      socket.join(documentId)
      socket.emit("load-document", document.noteBook);
      socket.on("update-contributor",async (documentId,userId,loggedInUserId) => {
        if (loggedInUserId  && userId && (userId !== loggedInUserId)) {
          const olderNoteBook = await NoteBook.findById(documentId);
          const updatedNoteBook = await NoteBook.findByIdAndUpdate(
              docId,
              { $addToSet: { contributers: loggedInUserId } },
              { new: true }
          );
          if ((olderNoteBook && updatedNoteBook) && olderNoteBook.contributers.length != updatedNoteBook?.contributers.length) {
            io.emit("contributors-updated", updatedNoteBook?.contributers);
          }
        }
      });
      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta)
      });
      socket.on("save-document", async (noteBook,docId,loggedInUserId,userId) => {
        if (loggedInUserId  && userId && (userId !== loggedInUserId)) {
          const olderNoteBook = await NoteBook.findById(docId);
          if (!olderNoteBook) {
            io.emit("refresh", ()=>{});
          }
          // const updatedNoteBook = await NoteBook.findByIdAndUpdate(
          //     docId,
          //     { $addToSet: { contributers: loggedInUserId } },
          //     { new: true }
          // );
          // if ((olderNoteBook && updatedNoteBook) && olderNoteBook.contributers.length != updatedNoteBook?.contributers.length) {
          //   io.emit("contributors-updated", updatedNoteBook?.contributers);
          // }
        }
        await NoteBook.findByIdAndUpdate(docId, {$set: {noteBook}});
      })
    } catch(error) {
      console.log("Error while fetching document", error);
    }
   
  })
})
  
async function findOrCreateDocument(id,userId,title,loggedInUserId) {
  try {
    if (id == null) return
    console.log("+++++Logging ID++++",id);
    const document = await NoteBook.findById(id);
    if (document) return  document;
    const createObj = {
      title: title,
      contributers: [],
      noteBook: {},
      userId: userId,
      sharedWith: [],
      group: "Un-Grouped"
    };
    return await NoteBook.create({_id : id ,...createObj})
  } catch(error) {
    console.log("Error while creating document", error);
  }
 
}
