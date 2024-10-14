"use strict";
const express = require("express");
const examController = require("../../controllers/exam.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const questionController = require("../../controllers/question.controller");
const router = express.Router();

// exam router for user
router.delete("/:id", authentication, asyncHandler(examController.deleteExam));

router.get("/list", authentication, asyncHandler(examController.listExams));

router.use(teacherAuthentication);

// exam router for teacher
router.get("/search", asyncHandler(examController.searchExams));

router.post("/create", asyncHandler(examController.createExam));

router.get("/:id", asyncHandler(examController.getExamById));

router.patch("/:id", asyncHandler(examController.updateExam));

module.exports = router;
