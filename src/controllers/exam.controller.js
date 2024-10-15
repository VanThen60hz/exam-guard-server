"use strict";

const { SuccessResponse } = require("../core/success.response");
const examService = require("../services/exam.service");

class ExamController {
    getExamById = async (req, res, next) => {
        const { id } = req.params;
        const exam = await examService.findExamById(id, req.userId);

        new SuccessResponse({
            message: "Exam retrieved successfully",
            metadata: exam,
        }).send(res);
    };

    createExam = async (req, res, next) => {
        const newExam = await examService.createExam(req);
        new SuccessResponse({
            message: "Exam created successfully",
            metadata: newExam,
        }).send(res);
    };

    updateExam = async (req, res, next) => {
        const { id } = req.params;
        const examData = req.body;
        const userId = req.userId;
        const updatedExam = await examService.updateExam(id, examData, userId);

        new SuccessResponse({
            message: "Exam updated successfully",
            metadata: updatedExam,
        }).send(res);
    };

    deleteExam = async (req, res, next) => {
        const { id } = req.params;
        const response = await examService.deleteExam(id);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listExams = async (req, res, next) => {
        try {
            const { teacher, status, page = 1, limit = 10 } = req.query;
            const filter = {
                ...(status && { status }),
            };

            let responseData;
            console.log("Role:", req.role);

            if (req.role === "TEACHER") {
                const teacherId = req.userId;
                responseData = await examService.listExamForTeacher(teacherId, page, limit);
            } else {
                if (teacher) filter.teacher = teacher;
                responseData = await examService.listExams(filter, page, limit);
            }

            new SuccessResponse({
                message: "List of exams retrieved successfully",
                metadata: {
                    total: responseData.total,
                    totalPages: responseData.totalPages,
                    exams: responseData.exams,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    searchExams = async (req, res, next) => {
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query;
        const { total, totalPages, exams } = await examService.filterExams(query, page, limit);

        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: {
                total,
                totalPages,
                exams,
            },
        }).send(res);
    };

    completeExam = async (req, res, next) => {
        const { id } = req.params;
        const userId = req.userId;
        const response = await examService.completeExam(id, userId);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };
}

module.exports = new ExamController();
