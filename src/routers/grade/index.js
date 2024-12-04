"use strict";
const express = require("express");
const gradeController = require("../../controllers/grade.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils"); // Giả sử đã thêm các middleware xác thực cho giáo viên và học sinh
const router = express.Router();

router.get("/view-completed", authentication, asyncHandler(gradeController.viewCompletedGrades));

router.get("/view-grade/:examId", authentication, asyncHandler(gradeController.viewGradeByExamId));

router.use(teacherAuthentication);

router.get("/list-by-exam/:examId", asyncHandler(gradeController.listGradesByExamId));

router.get("/search-by-exam/:examId", asyncHandler(gradeController.searchGradesByExamId));

module.exports = router;
