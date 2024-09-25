"use strict";
const express = require("express");
const UserController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

// edit user
router.patch("/user/:id", asyncHandler(UserController.updateUser));

// delete user
router.delete("/user/:id", asyncHandler(UserController.deleteUser));

// list users
router.get("/users", asyncHandler(UserController.listUsers));

// search users
router.get("/users/search", asyncHandler(UserController.searchUsers));

module.exports = router;
