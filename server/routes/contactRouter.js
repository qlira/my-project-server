var express = require('express');
const messageRoute = express.Router();
var mongoose = require('mongoose');

// model
let MessageModel = require('../models/Contact.js');
messageRoute.route('/create-message').post((req, res, next) => {
  MessageModel.create(req.body, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
});

messageRoute.route('/').get((req, res, next) => {
    MessageModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

messageRoute.route('/edit-message/:id').get((req, res, next) => {
   MessageModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
messageRoute.route('/update-message/:id').put((req, res, next) => {
  MessageModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Message successfully updated!')
    }
  })
})

// Delete
messageRoute.route('/delete-message/:id').delete((req, res, next) => {
  MessageModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = messageRoute;