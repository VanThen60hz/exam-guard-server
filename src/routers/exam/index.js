"use strict";
const express = require("express");
const examController = require("../../controllers/exam.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const checkExamSubmission = require("../../middlewares/checkExamSubmission");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const router = express.Router();

// exam router for user
router.get("/list", authentication, asyncHandler(examController.listExams));

router.get("/search", authentication, asyncHandler(examController.searchExams));

router.get("/join/:id", authentication, checkExamSubmission, asyncHandler(examController.joinExam));

router.post("/submit/:id", authentication, asyncHandler(examController.submitExam));

router.use(teacherAuthentication);

router.delete("/:id", authentication, asyncHandler(examController.deleteExam));

// exam router for teacher

router.post("/create", asyncHandler(examController.createExam));

router.get("/:id", asyncHandler(examController.getExamById));

router.patch("/:id", asyncHandler(examController.updateExam));

module.exports = router;
