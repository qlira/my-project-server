const Category = require("../models/Category");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({ msg: "Error" });
    }
    res.json({ data });
  });
};

exports.categoryById = async (req, res, next, id) => {
  await Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    req.category = category;
    next();
  });
};

exports.read = async (req, res) => {
  return res.json(req.category);
};

exports.remove = async (req, res) => {
  let category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Category removing failed",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  });
};

exports.update = async (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Category could not be updated",
      });
    }
    res.json(data);
  });
};

exports.list = async (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not find any category",
      });
    }

    res.json(data);
  });
};
