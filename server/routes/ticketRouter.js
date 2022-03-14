const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    list,
    create,
    update,
    remove,
    ticketById,
  } = require("../controllers/Ticket");


router.get("/", list);
router.post("/create", create);
router.put("/:ticketId", update);
router.delete("/:ticketId", remove)
router.param("ticketId", ticketById);

module.exports = router;
