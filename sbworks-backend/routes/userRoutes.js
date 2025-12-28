const express = require("express");
const auth = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth.protect, userController.getProfile);
router.put("/profile", auth.protect, userController.updateProfile);

router.get("/", auth.protect, auth.authorize("admin"), userController.getAllUsers);
router.put("/:id/block", auth.protect, auth.authorize("admin"), userController.blockUser);
router.delete("/:id", auth.protect, auth.authorize("admin"), userController.deleteUser);

module.exports = router;
