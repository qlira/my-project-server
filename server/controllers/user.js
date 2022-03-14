const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    let { firstName, lastName, email, password, passwordCheck } = req.body;
    // validate;
    console.log(req.body);

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields entered!" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "The password length must be at least 8 characters!" });
    if (password !== passwordCheck)
      return res.status(400).json({ msg: "The password does not match!" });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists!" });

    if (!firstName || !lastName) {
      firstName = email;
      lastName = email;
    }

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passHash,
      role: false,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate;
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered!" });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials!" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 2400 });
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: "Not all fields have been entered!" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered!" });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered!" });
    if (user.role === true) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials!" });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("t", token, { expire: new Date() + 2400 });
      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({ msg: "You have no access!" });
    }
  } catch (err) {
    res.status(400).json({ msg: "Not all fields have been entered!" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json({ deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    firstName: user.firstName,
    id: user._id,
    role: user.role,
  });
};

exports.logout = async (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout succeded" });
};

exports.userById = async (req, res, next, id) => {
  await User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = async (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.list = async (req, res) => {
  User.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not find any user",
      });
    }

    res.json(data);
  });
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.password = undefined;
      res.json(user);
    }
  );
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user purchase history",
        });
      }
      next();
    }
  );
};
