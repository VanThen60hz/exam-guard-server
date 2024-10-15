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

    listGrades = async (req, res, next) => {
        try {
            const { student, status, page = 1, limit = 10 } = req.query;
            const filter = {
                ...(status && { status }),
            };

            let responseData;
            console.log("Role:", req.role);

            if (req.role === "TEACHER") {
                const teacherId = req.userId;
                responseData = await gradeService.listGradesForTeacher(teacherId, page, limit);
            } else {
                if (student) filter.student = student;
                responseData = await gradeService.listGrades(filter, page, limit);
            }

            new SuccessResponse({
                message: "List of grades retrieved successfully",
                metadata: {
                    total: responseData.total,
                    totalPages: responseData.totalPages,
                    grades: responseData.grades,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    searchGrades = async (req, res, next) => {
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query;
        const { total, totalPages, grades } = await gradeService.filterGrades(query, page, limit);

        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: {
                total,
                totalPages,
                grades,
            },
        }).send(res);
    };
}

module.exports = new GradeController();
