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

module.exports = router;