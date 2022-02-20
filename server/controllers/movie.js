const formidable = require("formidable");
const _ = require("lodash");
const Movie = require("../models/Movie");
const fs = require("fs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  console.log("hini1");

  form.parse(req, (err, fields, files) => {
    console.log("hini2");

    if (err) {
      console.log("hini3");

      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    console.log("hini4");

    const { title, description, price, category, rating } = fields;
    console.log(fields);

    if (!title || !description || !price || !category || !rating) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let movie = new Movie(fields);
    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2 MB in size",
        });
      }
      movie.photo.data = fs.readFileSync(files.photo.path);
      movie.photo.contentType = files.photo.type;
    }

    movie.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Movie registration failed",
        });
      }

      res.json(result);
    });
  });
};

exports.movieById = async (req, res, next, id) => {
  await Movie.findById(id)
    .populate("category")
    .exec((err, movie) => {
      if (err || !movie) {
        return res.status(400).json({
          error: "Movie not found",
        });
      }
      req.movie = movie;
      next();
    });
};

exports.read = async (req, res) => {
  req.movie.photo = undefined;
  return res.json(req.movie);
};

exports.remove = async (req, res) => {
  let movie = req.movie;
  movie.remove((err, deletedMovie) => {
    if (err) {
      return res.status(400).json({
        error: "Movie removing failed",
      });
    }

    res.json({
      message: "Movie deleted successfully",
    });
  });
};

exports.update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    const { title, description, price, category, rating } = fields;

    if (!title || !description || !price || !category || !rating) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let movie = req.movie;
    movie = _.extend(movie, fields);

    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2 MB in size",
        });
      }
      movie.photo.data = fs.readFileSync(files.photo.path);
      movie.photo.contentType = files.photo.type;
    }

    movie.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Movie update failed",
        });
      }

      res.json(result);
    });
  });
};

/*
    sell / arrival
    by sell = /movies?sortBy=sold&order=desc&limit=4
    by arrivals = /movies?sortBy=createdAt&order=desc&limit=4
    if no params are sent, then all movies are returned
*/

exports.list = async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Movie.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Movies not found",
        });
      }

      res.send(data);
    });
};

/*
    it will find movies based on the req movie category
    other movies that has the same category, will be returned
*/

exports.listRelated = async (req, res) => {
  let limit = 4;

  Movie.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, movies) => {
      if (err) {
        return res.status(400).json({
          error: "Movies not found",
        });
      }

      res.json(movies);
    });
};

exports.listCategories = async (req, res) => {
  await Movie.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Categories not found",
      });
    }
    res.json(categories);
  });
};

/**
 * list movies by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// exports.listBySearch = async (req, res) => {
//     let order = req.body.order ? req.body.order : "desc";
//     let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
//     let limit = req.body.limit ? parseInt(req.body.limit) : 100;
//     let skip = parseInt(req.body.skip);
//     let findArgs = {};

//     // console.log(order, sortBy, limit, skip, req.body.filters);
//     // console.log("findArgs", findArgs);

//     for (let key in req.body.filters) {
//         if (req.body.filters[key].length > 0) {
//             if (key === "price") {
//                 // gte -  greater than price [0-10]
//                 // lte - less than
//                 findArgs[key] = {
//                     $gte: req.body.filters[key][0],
//                     $lte: req.body.filters[key][1]
//                 };
//             } else {
//                 findArgs[key] = req.body.filters[key];
//             }
//         }
//     }

//     await Movie.find(findArgs)
//         .select("-photo")
//         .populate("category")
//         .sort([[sortBy, order]])
//         .skip(skip)
//         .limit(limit)
//         .exec((err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "Movies not found"
//                 });
//             }
//             res.json({
//                 size: data.length,
//                 data
//             });
//         });
// };

exports.photo = async (req, res, next) => {
  if (req.movie.photo.data) {
    res.set("Content-Type", req.movie.photo.contentType);
    return res.send(req.movie.photo.data);
  }
  next();
};

// exports.listSearch = async (req, res) => {
//     const query = {};
//     if(req.query.search){
//         query.title = {$regex: req.query.search, $options: 'i'}
//         if(req.query.category && req.query.caregory != 'All'){
//             query.category = req.query.category
//         }

//         await Movie.find(query, (err, movies) => {
//             if(err){
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 })
//             }
//             res.json(movies);
//         }).select('-photo');
//     }else{
//         console.log("keq")
//     }
// }

// exports.decreaseQuantity = (req, res, next) => {
//     let bulkOps = req.body.order.movies.map(item => {
//         return {
//             updateOne:{
//                 filter: { _id: item._id },
//                 update: { $inc: { quantity: -item.count, sold: +item.count} }
//             }
//         }
//     });

//     Product.bulkWrite(bulkOps, {}, (error, movies) => {
//         if(error){
//             return res.status(400).json({
//                 error: "Could not update movie"
//             });
//         }
//         next();
//     });
// };
