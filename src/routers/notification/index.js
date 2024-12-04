"use strict";
const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("/list", authentication, asyncHandler(notificationController.listNotifications));

module.exports = router;
