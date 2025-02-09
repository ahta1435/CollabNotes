const { Router } = require('express');
const bcrypt = require("bcrypt");
const {v4 : uuidV4} = require("uuid");
const _ = require('lodash');
const User = require("../Schemas/userSchema.js");
const { setUser } = require('../service/auth.js');
const router = Router();

function validateUserInput(dataObj) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (_.isEmpty(dataObj.email) || !emailRegex.test(dataObj.email)) {
      return false;
    }

    if (_.isEmpty(dataObj.firstName)) {
      return false;
    }

    if (_.isEmpty(dataObj.password) || dataObj.password.length < 6) {
      return false;
    }
    return true;
}

router.post('/signup',async (req, res) => {    
    const { email, firstName, lastName, groups = "", password } = req.body;
    const userObj = {
      email : email,
      firstName : firstName,
      lastName: lastName,
      groups : [groups],
      password: password
    }
    if (req.body) {
       const isValid = validateUserInput(userObj);
       if (!isValid) {
         return res.status(500).json({message: "Please Give Valid Input"});
       }
    }

    await User.create(userObj); 
    return res.status(200).json({message: "Successfully Created User"});
});

router.post("/signIn",async (req,res) => {
  const {email,password} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({message : "No User found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const sessionId = uuidV4();
      setUser(user,sessionId);
      return res.status(200).json({sessionId : sessionId, userData : user});
    } else {
      return res.status(404).json({message : "user name or password doesn't match"});
    }
  } catch (error) {
    return res.status(500).json({message : error});
  }

});

router.post("/getUsers", async (req,res) => {
  try {
    const {userIds} = req.body;
    const user = await User.find({_id : {$in : userIds}});
    return res.status(200).json({data : user});
  } catch (err) {

  }
})

module.exports = router;