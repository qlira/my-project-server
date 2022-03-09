const Contact = require("../models/Contact");


// messageRoute.route('/').get((req, res, next) => {
//     MessageModel.find((error, data) => {
//      if (error) {
//        return next(error)
//      } else {
//        res.json(data)
//      }
//    })
//  })

exports.create = async (req, res) => {
    const contact = new Contact(req.body);
    contact.save((err, data) => {
      if (err) {
        return res.status(400).json({ msg: "Error" });
      }
      res.json({ data });
    });
  };

  exports.contactById = async (req, res, next, id) => {
    await Contact.findById(id).exec((err, contact) => {
      if (err || !contact) {
        return res.status(400).json({
          error: "Category not found",
        });
      }
      req.contact = contact;
      next();
    });
  };

  exports.remove = async (req, res) => {
    let contact = req.contact;
    contact.remove((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Contact removing failed",
        });
      }
  
      res.json({
        message: "Contact deleted successfully",
      });
    });
  };
  
  exports.update = async (req, res) => {
    const contact = req.contact;
    contact.fullName = req.body.fullName;
    contact.email = req.body.email;
    contact.messagebox = req.body.messagebox;
    contact.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Category could not be updated",
        });
      }
      res.json(data);
    });
  };
  

 exports.list = async (req, res) => {
  Contact.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not find any category",
      });
    }

    res.json(data);
  });
};


