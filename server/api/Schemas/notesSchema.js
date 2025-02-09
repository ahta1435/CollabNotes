const mongoose = require("mongoose");


const notesSchema = new mongoose.Schema({
  title : {
    type : String
  },
  contributers : {
    type : Array
  },
  noteBook : {
    type : Object
  },
  userId : {
    type : String
  },
  sharedWith : {
    type : Array
  },
  group : {
    type : String
  },
  _id : {
    type: String
  }
},{timestamps: true});

const NoteBook = mongoose.model("notebook",notesSchema,"notebooks");

module.exports = NoteBook;