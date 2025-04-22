const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");

router.post("/create", bookController.createBook);
router.put("/update/:id", bookController.updateBook);

router.get("/:id", bookController.getBook);

router.get("/book/list", bookController.getAllBooks);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
