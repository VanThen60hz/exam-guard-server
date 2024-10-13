"use strict";
const express = require("express");
const examController = require("../../controllers/exam.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const questionController = require("../../controllers/question.controller");
const router = express.Router();

router.delete("/:id", authentication, asyncHandler(examController.deleteExam));

router.get("/list", authentication, asyncHandler(examController.listExams));

router.get("/:examId/question/list", asyncHandler(questionController.listQuestions));

router.use(teacherAuthentication);

router.get("/search", asyncHandler(examController.searchExams));

router.post("/create", asyncHandler(examController.createExam));

router.get("/:id", asyncHandler(examController.getExamById));

router.patch("/:id", asyncHandler(examController.updateExam));

// question router

router.post("/:examId/question/create", asyncHandler(questionController.createQuestion));

router.patch("/:examId/question/:questionId", asyncHandler(questionController.updateQuestion));

router.delete("/:examId/question/:questionId", asyncHandler(questionController.deleteQuestion));

module.exports = router;
