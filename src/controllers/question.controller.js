"use strict";

const { SuccessResponse } = require("../core/success.response");
const questionService = require("../services/question.service");

class QuestionController {
    getQuestionById = async (req, res, next) => {
        const { id } = req.params;
        const question = await questionService.findQuestionById(id, req.userId);

        new SuccessResponse({
            message: "Question retrieved successfully",
            metadata: question,
        }).send(res);
    };

    createQuestion = async (req, res, next) => {
        const { examId } = req.params;
        const teacherId = req.userId;
        const questionBody = req.body;

        const newQuestion = await questionService.createQuestion(examId, teacherId, questionBody);
        new SuccessResponse({
            message: "Question created successfully",
            metadata: newQuestion,
        }).send(res);
    };

    updateQuestion = async (req, res, next) => {
        const { examId, questionId } = req.params;
        const questionBody = req.body;

        const teacherId = req.userId;

        const updatedQuestion = await questionService.updateQuestion(examId, questionId, teacherId, questionBody);

        new SuccessResponse({
            message: "Question updated successfully",
            metadata: updatedQuestion,
        }).send(res);
    };

    deleteQuestion = async (req, res, next) => {
        const { examId, questionId } = req.params;

        const teacherId = req.userId;
        const response = await questionService.deleteQuestion(examId, questionId, teacherId);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listQuestions = async (req, res, next) => {
        const { examId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        let teacherId;
        if (req.role === "TEACHER") {
            teacherId = req.userId;
        }
        const responseData = await questionService.listQuestions({ exam: examId }, teacherId, page, limit);

        new SuccessResponse({
            message: "List of questions retrieved successfully",
            metadata: {
                total: responseData.total,
                totalPages: responseData.totalPages,
                questions: responseData.questions,
            },
        }).send(res);
    };

    searchQuestions = async (req, res, next) => {
        const { examId } = req.params; // Lấy examId từ URL
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query;

        const { total, totalPages, questions } = await questionService.filterQuestions(query, page, limit, examId);

        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: {
                total,
                totalPages,
                questions,
            },
        }).send(res);
    };
}

module.exports = new QuestionController();
