"use strict";
const express = require("express");
const gradeController = require("../../controllers/grade.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, studentAuthentication, authentication } = require("../../auth/authUtils"); // Giả sử đã thêm các middleware xác thực cho giáo viên và học sinh
const router = express.Router();

router.get("/:id", authentication, asyncHandler(gradeController.getGradeById));
router.get("/view-grade/:examId", authentication, asyncHandler(gradeController.viewGrade));

router.use(teacherAuthentication);

router.get("/list-by-exam/:examId", asyncHandler(gradeController.listGradesByExamId));

router.get("/search-by-exam/:examId", asyncHandler(gradeController.searchGradesByExamId));

module.exports = router;
