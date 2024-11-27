"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const { handleImageUpload } = require("../../middlewares/multerHandler");
const router = express.Router();

router.post("/signup", handleImageUpload, asyncHandler(accessController.signUp));

router.post("/login", asyncHandler(accessController.login));

router.post("/forgot-password", asyncHandler(accessController.forgotPassword));

router.post("/reset-password", asyncHandler(accessController.resetPassword));

router.use(authenticationV2);

router.post("/logout", authentication, asyncHandler(accessController.logout));

router.post("/refresh-token", authenticationV2, asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
