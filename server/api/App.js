require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const CONNECTION_URL = process.env.MONGODB_URI;
const user = require("./controllers/userController");
const note = require("./controllers/noteBookController");
const email = require("./controllers/sendMailController");

mongoose.connect(CONNECTION_URL,{
    dbName: 'CollabEditor'
});

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://collab-notes-7xmm.vercel.app/');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});
app.use('/user',user);
app.use("/notebook",note);
app.use("/mail",email);


module.exports = app;
