"use strict";
const express = require("express");
const answerController = require("../../controllers/answer.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("/:id", authentication, asyncHandler(answerController.getAnswerById));

router.post("/:id", authentication, asyncHandler(answerController.answerQuestion));

router.use(teacherAuthentication);

router.get("/list/:questionId", asyncHandler(answerController.listAnswersByQuestion));

module.exports = router;
