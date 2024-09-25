"use strict";
const express = require("express");
const UserController = require("../../controllers/user.controller");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { adminAuthentication } = require("../../auth/authUtils"); // Import middleware
const router = express.Router();

router.use(adminAuthentication);

// sign up
router.post("/create", asyncHandler(accessController.signUp));

// find user by id
router.get("/user/:id", asyncHandler(UserController.findUserById));

// edit user
router.patch("/user/:id", asyncHandler(UserController.updateUser));

// delete user
router.delete("/user/:id", asyncHandler(UserController.deleteUser));

// list users
router.get("/users", asyncHandler(UserController.listUsers));

// search users
router.get("/users/search", asyncHandler(UserController.searchUsers));

module.exports = router;
