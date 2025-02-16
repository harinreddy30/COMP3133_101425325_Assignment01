const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { 
        type: String, unique: true, required: true, 
        validate: [validator.isEmail, "Invalid email format"]
    },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });

  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  module.exports = mongoose.model("User", UserSchema);