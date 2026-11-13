const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();
router.get("/users", userController.index);
router.get("/users/:id", userController.show);
router.post("/users", userController.store);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
module.exports = router;
