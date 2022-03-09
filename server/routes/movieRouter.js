const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  create,
  movieById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  paginatedList,
  photo,
} = require("../controllers/movie");
const { userById } = require("../controllers/user");

router.get("/moviePagination", paginatedList);

router.post("/create", create);
router.get("/:movieId", read); //ka qene auth para read
router.delete("/:movieId", remove);
router.put("/:movieId", update);

router.get("/", list);
router.get("/related/:movieId", listRelated);
router.get("/categories/list", listCategories);
router.get("/movie/photo/:movieId", photo);

router.param("movieId", movieById);
router.param("userId", userById);

module.exports = router;
