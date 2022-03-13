const Ticket = require("../models/Ticket");
const _ = require("lodash");

exports.create = async (req, res) => {
  const ticket = new Ticket(req.body);
  console.log("hini1", ticket);
  ticket.save((err, data) => {
    if (err) {
      return res.status(400).json({ msg: "Error" });
    }
    res.json({ data });
  });
};

exports.update = async (req, res) => {
  let ticket = req.ticket;
  ticket = _.extend(ticket, fields);

  ticket.save((err, result) => {
    if (err) {
      console.log("err", err);
      return res.status(400).json({
        error: "Ticket update failed",
      });
    }

    res.json(result);
  });
};

exports.list = async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  exports.remove = async (req, res) => {
    let ticket = req.ticket;
    ticket.remove((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Ticket removing failed",
        });
      }
  
      res.json({
        message: "Ticket deleted successfully",
      });
    });
  };
  
  exports.update = async (req, res) => {
    const ticket = req.ticket;
    ticket.quantity = req.body.quantity
    ticket.totalPrice = req.body.totalPrice
    ticket.user = req.body.user;
    ticket.movie = req.body.movie;
    ticket.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Ticket could not be updated",
        });
      }
      res.json(data);
    });
  };

  exports.list = async (req, res) => {
    Ticket.find().exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Could not find any ticket",
        });
      }
  
      res.json(data);
    });
  };