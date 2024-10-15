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
        const { id } = req.params;

        const newAnswer = await answerService.answerQuestion(req, id, studentId);
        new SuccessResponse({
            message: "Answer created successfully",
            metadata: newAnswer,
        }).send(res);
    };

    listAnswersByQuestion = async (req, res, next) => {
        const { questionId } = req.params;
        const answers = await answerService.listAnswersByQuestion(questionId);

        new SuccessResponse({
            message: "Answers retrieved successfully",
            metadata: answers,
        }).send(res);
    };

    listAnswersByStudentId = async (req, res, next) => {
        const { examId, studentId } = req.params;
        const { page, limit } = req.query;

        const answers = await answerService.listAnswersByStudent(studentId, examId, page, limit);

        new SuccessResponse({
            message: "Answers retrieved successfully",
            metadata: answers,
        }).send(res);
    };
}

module.exports = new AnswerController();
