"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("/signup", asyncHandler(accessController.signUp));

router.post("/login", asyncHandler(accessController.login));

router.use(authenticationV2);

router.post("/logout", authentication, asyncHandler(accessController.logout));

router.post("/refresh-token", authenticationV2, asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
