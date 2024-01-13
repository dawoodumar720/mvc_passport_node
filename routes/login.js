const express = require("express");
const {
  registerView,
  loginView,
  registerUser,
  loginUser,
} = require("../controllers/loginController");
const { dashboardView } = require("../controllers/dashboardController");
const router = express.Router();
const { protectRoute } = require("../auth/protect");

// Login routes
router.get("/login", loginView);
router.get("/register", registerView);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

// Dashboard route
router.get("/dashboard", protectRoute, dashboardView);

module.exports = router;
