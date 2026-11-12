const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();
router.get("/users", userController.index);
router.get("/users/:id", userController.show);
module.exports = router;
