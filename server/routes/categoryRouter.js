const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  create,
  read,
  categoryById,
  update,
  remove,
  list,
} = require("../controllers/category");
const { userById } = require("../controllers/user");

router.post("/create", create);
router.get("/:categoryId", auth, read);
router.get("/", list);
router.delete("/:categoryId", remove);
router.put("/:categoryId", update);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;
