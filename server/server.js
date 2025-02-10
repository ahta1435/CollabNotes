const http = require("http");
const app = require('./App');
const NoteBook = require('./Schemas/notesSchema');
require('dotenv').config();
//port at which the project shld run
const port = process.env.port || 8000;

const server = http.createServer(app);

const io = require('socket.io')(server,{
    cors : {
        origin: `https://collab-notes-frontend-iota.vercel.app`,
        methods: ["GET", "POST"],
    }
});

server.listen(port, () => {
    const address = server.address();
    
    console.log(`Server running at http://${address.address}:${address.port}/`);
});


io.on("connection", socket => {
  socket.on("get-document", async (documentId,userId,title) => {
    const document = await findOrCreateDocument(documentId,userId,title);
    console.log("---------Logged documentId-----------", documentId);
    if (!document) {
        return;
    }
    console.log("---------User Id-----------", userId);
    socket.join(documentId)
    socket.emit("load-document", document.noteBook);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    });
    socket.on("save-document", async (noteBook,docId,loggedInUserId,userId) => {
      if (userId !== loggedInUserId) {
        const olderNoteBook = await NoteBook.findById(docId);
        const updatedNoteBook = await NoteBook.findByIdAndUpdate(
            docId,
            { $addToSet: { contributers: loggedInUserId } },
            { new: true }
        );
        if ((olderNoteBook && updatedNoteBook) && olderNoteBook.contributers.length != updatedNoteBook?.contributers.length) {
          io.emit("contributors-updated", updatedNoteBook?.contributers);
        }
      }
      await NoteBook.findByIdAndUpdate(docId, {$set: {noteBook}});
    })
  })
})
  
async function findOrCreateDocument(id,userId,title) {
  if (id == null) return

  const document = await NoteBook.findById(id)
  if (document) return document;

  const createObj = {
    title: title,
    contributers: [],
    noteBook: {},
    userId: userId,
    sharedWith: [],
    group: "Un-Grouped"
  };
  return await NoteBook.create({_id : id ,...createObj})
}
