"use strict";
const express = require("express");
const userController = require("../../controllers/user.controller");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { adminAuthentication, authentication } = require("../../auth/authUtils"); // Import middleware
const router = express.Router();

router.get("/profile", authentication, asyncHandler(userController.getProfile));

router.patch("/profile", authentication, asyncHandler(userController.updateProfile));

router.use(adminAuthentication);

router.get("/list", asyncHandler(userController.listUsers));

router.get("/search", asyncHandler(userController.searchUsers));

router.post("/create", asyncHandler(accessController.signUp));

router.get("/:id", asyncHandler(userController.findUserById));

router.patch("/:id", asyncHandler(userController.updateUser));

router.delete("/:id", asyncHandler(userController.deleteUser));

module.exports = router;
