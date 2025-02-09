const { Router } = require('express');
const User = require("../Schemas/userSchema.js");
const router = Router();

router.post("/getUsers", async (req,res) => {
    try {
      const {userIds} = req.body;
      const user = await User.find({_id : {$in : userIds}});
      return res.status(200).json({data : user});
    } catch (err) {
  
    }
})

module.exports = router;