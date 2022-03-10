const router = require("express").Router();
const auth = require("../middleware/auth");

const { list, create } = require("../controllers/ticket");

router.get("/", list);
router.post("/create", create);

module.exports = router;
