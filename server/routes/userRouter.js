const router = require("express").Router();
const User = require("../models/User");

const auth = require("../middleware/auth");
// const { isAdmin } = require("../middleware/isAdmin");

const {
  register,
  login,
  // loginAdmin,
  deleteUser,
  tokenIsValid,
  getUser,
  userById,
  read,
  update,
  list
} = require("../controllers/user");

router.post("/register", register);

router.post("/login", login);
// router.post("/login/admin", loginAdmin);

// router.delete("/delete", deleteUser);

router.post("/tokenIsValid", tokenIsValid);

// router.get("/", auth, getUser);
router.get("/", list);
// router.get("/secret/:userId", auth, isAdmin, (req, res) => {
//   res.json({
//     user: req.profile,
//   });
// });

router.get("/user/:userId", auth, read);
router.put("/user/:userId", update);

router.param("userId", userById);

module.exports = router;
