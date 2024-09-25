"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

//login
router.post("/login", asyncHandler(accessController.login));

// sign up
router.post("/signup", asyncHandler(accessController.signUp));

module.exports = router;
