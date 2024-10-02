"use strict";
const express = require("express");
const UserController = require("../../controllers/user.controller");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { adminAuthentication, authentication } = require("../../auth/authUtils"); // Import middleware
const router = express.Router();

// get profile
router.get("/profile", authentication, asyncHandler(UserController.getProfile));

// update profile
router.patch("/profile", authentication, asyncHandler(UserController.updateProfile));

// check admin
router.use(adminAuthentication);

// list users
router.get("/list", asyncHandler(UserController.listUsers));

// search users
router.get("/search", asyncHandler(UserController.searchUsers));

// sign up
router.post("/create", asyncHandler(accessController.signUp));

// find user by id
router.get("/:id", asyncHandler(UserController.findUserById));

// edit user
router.patch("/:id", asyncHandler(UserController.updateUser));

// delete user
router.delete("/:id", asyncHandler(UserController.deleteUser));

module.exports = router;
