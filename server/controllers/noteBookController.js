const { Router } = require('express');
const NoteBook = require("../Schemas/notesSchema");
const router = Router();

router.get('/notes/:userId',async (req, res) => {   
   try {
     const userData = req.params.userId;
     const userId = userData.split("=")[1];
     const data = await NoteBook.find({userId}); 
     return res.status(200).json({data : data});
   } catch (e) {
      return res.status(404).json({data : data});
   }
  
});

router.get('/notes/:notesId',async (req, res) => {
  const {notesId} = req.params.notesId;
  const data = await NoteBook.deleteOne({_id: notesId}); 
  return res.status(200).json({data : data});
});


router.post('/notes/update',async (req, res) => {    
  const {group,id} = req.body;
  await NoteBook.findByIdAndUpdate({id, $set: {group}}); 
  return res.status(200).json({message: "Updated SuccessFully"});
});

module.exports = router;