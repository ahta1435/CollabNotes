const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const CONNECTION_URL = "mongodb://127.0.0.1:27017";
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
app.use('/user',user);
app.use("/notebook",note);
app.use("/mail",email);


module.exports = app;
