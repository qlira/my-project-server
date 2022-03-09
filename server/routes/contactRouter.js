const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  list,
  create,
  update,
  remove,
  contactById,
} = require("../controllers/contact");


router.get("/", list);
router.post("/create", create)
router.put("/:contactId", update)
router.delete("/:contactId", remove)
router.param("contactId", contactById);


module.exports = router;