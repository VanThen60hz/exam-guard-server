"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// sign up
router.post("/user/signup", asyncHandler(accessController.signUp));

//login
router.post("/user/login", asyncHandler(accessController.login));

// edit user
router.patch("/user/:id", asyncHandler(accessController.editUser));

// delete user
router.delete("/user/:id", asyncHandler(accessController.deleteUser));

// list users
router.get("/users", asyncHandler(accessController.listUsers));

module.exports = router;
