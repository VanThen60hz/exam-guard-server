"use strict";
const express = require("express");
const examController = require("../../controllers/exam.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const questionController = require("../../controllers/question.controller");
const router = express.Router();

// question router for user
router.get("/:examId/list", authentication, asyncHandler(questionController.listQuestions));

router.get("/:examId/search", authentication, asyncHandler(questionController.searchQuestions));

router.use(teacherAuthentication);

// question router for teacher
router.post("/:examId/create", asyncHandler(questionController.createQuestion));

router.patch("/:examId/:questionId", asyncHandler(questionController.updateQuestion));

router.delete("/:examId/:questionId", asyncHandler(questionController.deleteQuestion));

module.exports = router;
