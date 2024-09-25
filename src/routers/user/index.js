"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

// edit user
router.patch("/user/:id", asyncHandler(accessController.updateUser));

// delete user
router.delete("/user/:id", asyncHandler(accessController.deleteUser));

// list users
router.get("/users", asyncHandler(accessController.listUsers));

// search users
router.get("/users/search", asyncHandler(accessController.searchUsers));

module.exports = router;
