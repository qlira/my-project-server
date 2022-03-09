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


