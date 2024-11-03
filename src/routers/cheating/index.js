"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const cheatingHistoryController = require("../../controllers/cheatingHistory.controller");
const cheatingStatisticController = require("../../controllers/cheatingStatistic.controller");
const router = express.Router();

router.post("/detect-cheating/:examId/", authentication, asyncHandler(cheatingHistoryController.detectCheating));

router.use(teacherAuthentication);

router.get("/list-cheating-statistics/:examId", asyncHandler(cheatingStatisticController.listCheatingStatistics));

router.get("/list-cheating-histories/:examId", asyncHandler(cheatingHistoryController.listCheatingHistories));

router.get(
    "/list-cheating-statistic-by-student/:examId/:studentId",
    asyncHandler(cheatingStatisticController.listCheatingStatisticsByStudentId),
);

router.get(
    "/list-cheating-histories-by-student/:examId/:studentId",
    asyncHandler(cheatingHistoryController.listCheatingHistoriesByStudentId),
);

module.exports = router;
