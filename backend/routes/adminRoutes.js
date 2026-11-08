
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const {
  getStats,
  getUsers,
  updateRole,
  updateStatus,
  deleteUser,
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(requireRole("superadmin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateRole);
router.patch("/users/:id/status", updateStatus);
router.delete("/users/:id", deleteUser);

module.exports = router;
