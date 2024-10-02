"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// // sign up
router.post("/signup", asyncHandler(accessController.signUp));

//login
router.post("/login", asyncHandler(accessController.login));

// authentication
// router.use(authentication);
router.use(authenticationV2);

// logout
router.post("/logout", authentication, asyncHandler(accessController.logout));

// authenticationV2
router.post("/refresh-token", authenticationV2, asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
