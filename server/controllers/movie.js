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
    if (err) {
      console.log("hini3");

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

    console.log("category", fields);

    let movie = new Movie(fields);
    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2 MB in size",
        });
      }
      movie.photo.data = fs.readFileSync(files.photo.filepath);
      movie.photo.contentType = files.photo.mimetype;
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
          error: "Movie not found1",
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
    console.log("updatedFields", fields);

    if (!title || !description || !price || !category || !rating) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    console.log("req", req);
    let movie = req.movie;
    movie = _.extend(movie, fields);
    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2 MB in size",
        });
      }

      console.log(files.photo.path);

      movie.photo.data = fs.readFileSync(files.photo.filepath);
      movie.photo.contentType = files.photo.mimetype;
    }

    movie.save((err, result) => {
      if (err) {
        console.log("err", err);
        return res.status(400).json({
          error: "Movie update failed",
        });
      }

      res.json(result);
    });
  });
};



exports.list = async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Movie.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Movies not found",
        });
      }

      res.send(data);
    });
};
exports.paginatedList = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 4;
  const offset = (page - 1) * limit;
  console.log(page);
  Movie.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .skip(offset)
    .then((data) => {
      res.send(data);
    });
};



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

exports.photo = async (req, res, next) => {
  if (req.movie.photo.data) {
    res.set("Content-Type", req.movie.photo.contentType);
    return res.send(req.movie.photo.data);
  }
  next();
};

