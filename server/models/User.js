const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the User Schema(Model)
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 32,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: { type: Boolean, default: false },
});

module.exports = User = mongoose.model("User", UserSchema);
