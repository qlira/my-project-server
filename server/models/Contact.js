const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  messagebox: {
    type: String
  },
}, {
  collection: 'messages'
})
module.exports = mongoose.model('Message', messageSchema)