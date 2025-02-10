const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    unique: true
  },
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String
  },
  groups : {
    type: Array
  },
  password : {
    type : String,
    minlength: 6,
    trim: true
  }
},{timestamps: true});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user",userSchema,"user");

module.exports = User;