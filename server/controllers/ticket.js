const Ticket = require("../models/Ticket");


exports.list = async (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Ticket.find()
      .populate("movie")
      .populate("user")
      .sort([[sortBy, order]])
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: "Tickets not found",
          });
        }
  
        res.send(data);
      });
  };