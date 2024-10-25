"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const cheatingController = require("../../controllers/cheating.controller");
const router = express.Router();

router.post("/detect-cheating/:examId/", authentication, asyncHandler(cheatingController.detectCheating));

router.use(teacherAuthentication);

router.get("/list-cheating-histories/:examId", asyncHandler(cheatingController.listCheatingHistories));

router.get(
    "/list-cheating-histories-by-student/:examId/:studentId",
    asyncHandler(cheatingController.listCheatingHistoriesByStudentId),
);

module.exports = router;
