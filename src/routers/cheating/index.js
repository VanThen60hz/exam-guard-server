"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const cheatingController = require("../../controllers/cheating.controller");
const router = express.Router();

router.post("/:examId/detect-cheating", authentication, asyncHandler(cheatingController.detectCheating));

router.get("/:id", authentication, asyncHandler(cheatingController.getCheatingHistoryById));

module.exports = router;
