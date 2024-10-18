"use strict";
const express = require("express");
const gradeController = require("../../controllers/grade.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("/:id", authentication, asyncHandler(gradeController.getGradeById));

module.exports = router;
