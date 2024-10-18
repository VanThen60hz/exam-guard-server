"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const gradeRepo = require("../repo/grade.repo");

class GradeService {
    static findGradeById = async (gradeId, userId) => {
        const grade = await gradeRepo.findGradeById(gradeId);

        if (!grade) {
            throw new BadRequestError("Grade not found");
        }

        if (grade.student._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this grade");
        }

        return getInfoData({
            fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
            object: grade,
        });
    };

    static createGrade = async (req) => {
        const teacherId = req.userId;
        if (!teacherId) {
            throw new UnauthorizedError("You are not authorized to create a grade");
        }

        const gradeData = {
            ...req.body,
            teacher: teacherId,
        };

        const newGrade = await gradeRepo.createGrade(gradeData);
        return getInfoData({
            fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
            object: newGrade,
        });
    };

    static updateGrade = async (gradeId, gradeData, userId) => {
        const gradeToUpdate = await gradeRepo.findGradeById(gradeId);
        if (!gradeToUpdate) {
            throw new BadRequestError("Grade not found");
        }

        if (gradeToUpdate.teacher._id.toString() !== userId) {
            throw new ForbiddenError("You do not have permission to update this grade");
        }

        const updatedGrade = await gradeRepo.updateGrade(gradeId, gradeData);
        if (!updatedGrade) {
            throw new BadRequestError("Failed to update grade");
        }

        return getInfoData({
            fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
            object: updatedGrade,
        });
    };

    static deleteGrade = async (gradeId) => {
        const deletedGrade = await gradeRepo.deleteGrade(gradeId);
        if (!deletedGrade) {
            throw new BadRequestError("Grade not found");
        }
        return { message: "Grade deleted successfully" };
    };

    static listGrades = async (filter = {}, page, limit) => {
        const totalGrades = await gradeRepo.countGrades(filter);
        const grades = await gradeRepo.listGrades(filter, page, limit);
        const totalPages = Math.ceil(totalGrades / limit);
        return {
            total: totalGrades,
            totalPages,
            grades: grades.map((grade) =>
                getInfoData({
                    fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
                    object: grade,
                }),
            ),
        };
    };

    static listGradesForStudent = async (studentId, page = 1, limit = 10) => {
        if (!studentId) {
            throw new BadRequestError("Student ID is required");
        }

        const filter = { student: studentId };

        const totalGrades = await gradeRepo.countGrades(filter);

        const grades = await gradeRepo.listGrades(filter, page, limit);
        const totalPages = Math.ceil(totalGrades / limit);

        return {
            total: totalGrades,
            totalPages,
            grades: grades.map((grade) =>
                getInfoData({
                    fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
                    object: grade,
                }),
            ),
        };
    };

    static filterGrades = async (query, page, limit) => {
        console.log("Query:", query);

        const { totalGrades, grades } = await gradeRepo.filterGrades(query, page, limit);
        const totalPages = Math.ceil(totalGrades / limit);
        return {
            total: totalGrades,
            totalPages,
            grades: grades.map((grade) =>
                getInfoData({
                    fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
                    object: grade,
                }),
            ),
        };
    };

    static calculateGradeForStudent = async (examId, studentId) => {
        const grade = await gradeRepo.calculateGradeForStudent(examId, studentId);
        return getInfoData({
            fields: ["_id", "score", "exam", "student", "createdAt", "updatedAt"],
            object: grade,
        });
    };
}

module.exports = GradeService;
