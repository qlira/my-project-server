const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    list,
    create,
    update,
    remove,
    ticketById,
  } = require("../controllers/Ticket");

const { list, create, update } = require("../controllers/ticket");

router.get("/", list);
router.post("/create", create);
router.put("/:ticketId", update);

module.exports = router;
