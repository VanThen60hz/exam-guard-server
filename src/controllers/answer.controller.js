"use strict";

const { SuccessResponse } = require("../core/success.response");
const answerService = require("../services/answer.service");

class AnswerController {
    getAnswerById = async (req, res, next) => {
        const { id } = req.params;
        const answer = await answerService.findAnswerById(id, req.userId);

        new SuccessResponse({
            message: "Answer retrieved successfully",
            metadata: answer,
        }).send(res);
    };

    answerQuestion = async (req, res, next) => {
        const studentId = req.userId;
        const { questionId } = req.params;

        const newAnswer = await answerService.answerQuestion(req, questionId, studentId);
        new SuccessResponse({
            message: "Answer created successfully",
            metadata: newAnswer,
        }).send(res);
    };

    listAnswers = async (req, res, next) => {
        try {
            const { question, page = 1, limit = 10 } = req.query;
            const filter = {
                ...(question && { question }),
            };

            let responseData;

            if (req.role === "TEACHER") {
                const teacherId = req.userId;
                responseData = await answerService.listAnswersForTeacher(teacherId, page, limit);
            } else {
                responseData = await answerService.listAnswers(filter, page, limit);
            }

            new SuccessResponse({
                message: "List of answers retrieved successfully",
                metadata: {
                    total: responseData.total,
                    totalPages: responseData.totalPages,
                    answers: responseData.answers,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    searchAnswers = async (req, res, next) => {
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query;
        const { total, totalPages, answers } = await answerService.filterAnswers(query, page, limit);

        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: {
                total,
                totalPages,
                answers,
            },
        }).send(res);
    };
}

module.exports = new AnswerController();
