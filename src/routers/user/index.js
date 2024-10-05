"use strict";
const express = require("express");
const userController = require("../../controllers/user.controller");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { adminAuthentication, authentication } = require("../../auth/authUtils"); // Import middleware
const router = express.Router();

// get profile
router.get("/profile", authentication, asyncHandler(userController.getProfile));

// update profile
router.patch("/profile", authentication, asyncHandler(userController.updateProfile));

// check admin
router.use(adminAuthentication);

// list users
router.get("/list", asyncHandler(userController.listUsers));

// search users
router.get("/search", asyncHandler(userController.searchUsers));

// sign up
router.post("/create", asyncHandler(accessController.signUp));

// find user by id
router.get("/:id", asyncHandler(userController.findUserById));

// edit user
router.patch("/:id", asyncHandler(userController.updateUser));

// delete user
router.delete("/:id", asyncHandler(userController.deleteUser));

module.exports = router;
