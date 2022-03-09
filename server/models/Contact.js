const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  messagebox: {
    type: String,
    required: true,
    maxlength:300
  },
});
module.exports = Contact = mongoose.model("Contact", contactSchema);
