const { Router } = require('express');
const NoteBook = require("../Schemas/notesSchema");
const router = Router();
const socket = require("../server");

router.get('/notes/:userId',async (req, res) => {   
   try {
     const userData = req.params.userId;
     const userId = userData.split("=")[1];
     const data = await NoteBook.find({userId});
     const sharedNotes = await NoteBook.find({contributers: userId});
     return res.status(200).json({data : {data,sharedNotes}});
   } catch (e) {
      return res.status(404).json({data : e});
   }
  
});

router.delete('/notes/:notesId',async (req, res) => {
  try {
    const notesId = req.params.notesId;
    const noteId = notesId.split("=")[1];
    const data = await NoteBook.deleteOne({_id: noteId});
    return res.status(200).json({data : data});
  } catch(err) {
    return res.status(500).json({message: "Something wrong happened"});
  }
});


router.post('/notes/update',async (req, res) => {
  try {
    const {group,id} = req.body;
    await NoteBook.findByIdAndUpdate(id, {$set: {group: group}}); 
    return res.status(200).json({message: "Updated SuccessFully"});
  } catch(err) {
    return res.status(500).json({message: "Something wrong happened"});
  }
  
});

router.get('/contributors/:notesId', async (req,res) => {
  try {
    const notedId = req.params.notesId;
    const noteId = notedId.split("=")[1];
    const data = await NoteBook.find({_id: noteId});
    return res.status(200).json({contributors : data});
  } catch (e) {
     return res.status(404).json({data : e});
  }
});

module.exports = router;