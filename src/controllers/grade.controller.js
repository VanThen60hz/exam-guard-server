"use strict";

const { SuccessResponse } = require("../core/success.response");
const gradeService = require("../services/grade.service");

class GradeController {
    getGradeById = async (req, res, next) => {
        const { id } = req.params;
        const grade = await gradeService.findGradeById(id, req.userId);

        new SuccessResponse({
            message: "Grade retrieved successfully",
            metadata: grade,
        }).send(res);
    };

    createGrade = async (req, res, next) => {
        const newGrade = await gradeService.createGrade(req);
        new SuccessResponse({
            message: "Grade created successfully",
            metadata: newGrade,
        }).send(res);
    };

    updateGrade = async (req, res, next) => {
        const { id } = req.params;
        const gradeData = req.body;
        const userId = req.userId;
        const updatedGrade = await gradeService.updateGrade(id, gradeData, userId);

        new SuccessResponse({
            message: "Grade updated successfully",
            metadata: updatedGrade,
        }).send(res);
    };

    deleteGrade = async (req, res, next) => {
        const { id } = req.params;
        const response = await gradeService.deleteGrade(id);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listGradesByExamId = async (req, res, next) => {
        const { examId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!examId) {
            throw new BadRequestError("Exam ID is required");
        }

        const teacherId = req.userId;
        const responseData = await gradeService.listGradesByExamId(examId, teacherId, page, limit);

        new SuccessResponse({
            message: "List of grades for exam retrieved successfully",
            metadata: {
                total: responseData.total,
                totalPages: responseData.totalPages,
                grades: responseData.grades,
            },
        }).send(res);
    };

    searchGradesByExamId = async (req, res, next) => {
        const { examId } = req.params;
        const { query, page = 1, limit = 10 } = req.query;

        if (!examId) {
            throw new BadRequestError("Exam ID is required");
        }

        const teacherId = req.userId;
        const responseData = await gradeService.searchGradesByExamId(examId, query, teacherId, page, limit);

        new SuccessResponse({
            message: "Search results for grades retrieved successfully",
            metadata: {
                total: responseData.total,
                totalPages: responseData.totalPages,
                grades: responseData.grades,
            },
        }).send(res);
    };

    viewGradeByExamId = async (req, res, next) => {
        const { examId } = req.params;

        if (!examId) {
            throw new BadRequestError("Exam ID is required");
        }

        const studentId = req.userId;
        const gradeData = await gradeService.viewGradeByExamId(examId, studentId);

        new SuccessResponse({
            message: "Grade for exam retrieved successfully",
            metadata: gradeData,
        }).send(res);
    };

    viewCompletedGrades = async (req, res, next) => {
        const studentId = req.userId;
        const { page = 1, limit = 10 } = req.query;

        const responseData = await gradeService.listGradesByStudent(studentId, page, limit);

        new SuccessResponse({
            message: "List of completed grades retrieved successfully",
            metadata: {
                total: responseData.total,
                totalPages: responseData.totalPages,
                grades: responseData.grades,
            },
        }).send(res);
    };
}

module.exports = new GradeController();
