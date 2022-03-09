const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

//Create the Ticket Schema(Model)
const ticketSchema = new Schema({
  quantity: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32,
  },
  totalPrice: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  movie: {
    type: ObjectId,
    ref: "Movie",
    required: true,
  },
});

module.exports = User = mongoose.model("Ticket", ticketSchema);
