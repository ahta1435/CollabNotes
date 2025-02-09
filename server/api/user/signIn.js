const { Router } = require('express');
const bcrypt = require("bcrypt");
const {v4 : uuidV4} = require("uuid");
const _ = require('lodash');
const User = require("../Schemas/userSchema.js");
const { setUser } = require('../service/auth.js');
const router = Router();

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

module.exports = router;