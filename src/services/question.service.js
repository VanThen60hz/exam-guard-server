"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const questionRepo = require("../repo/question.repo");
const examRepo = require("../repo/exam.repo");

class QuestionService {
    static findQuestionById = async (questionId, userId) => {
        const question = await questionRepo.findQuestionById(questionId);
        console.log("Fetched Question:", question);

        if (!question) {
            throw new BadRequestError("Question not found");
        }

        if (question.exam.teacher.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this question");
        }

        return getInfoData({
            fields: [
                "_id",
                "questionText",
                "questionType",
                "questionScore",
                "correctAnswer",
                "options",
                "exam",
                "createdAt",
                "updatedAt",
            ],
            object: question,
        });
    };

    static createQuestion = async (examId, teacherId, questionBody) => {
        const examToCheck = await examRepo.findExamById(examId);

        if (!examToCheck || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to add a question to this exam");
        }

        const questionData = {
            ...questionBody,
            exam: examToCheck._id,
        };

        console.log("Question Data:", questionData);

        const newQuestion = await questionRepo.createQuestion(questionData);
        return getInfoData({
            fields: [
                "_id",
                "questionText",
                "questionType",
                "questionScore",
                "correctAnswer",
                "options",
                "createdAt",
                "updatedAt",
            ],
            object: newQuestion,
        });
    };

    static updateQuestion = async (examId, questionId, teacherId, questionBody) => {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to update a question on this exam");
        }

        const questionToUpdate = await questionRepo.findQuestionById(questionId);
        if (!questionToUpdate) {
            throw new BadRequestError("Question not found");
        }

        const questionData = {
            ...questionBody,
            exam: examToCheck._id,
        };

        const updatedQuestion = await questionRepo.updateQuestion(questionId, questionData);
        if (!updatedQuestion) {
            throw new BadRequestError("Failed to update question");
        }

        return getInfoData({
            fields: [
                "_id",
                "questionText",
                "questionType",
                "questionScore",
                "correctAnswer",
                "options",
                "createdAt",
                "updatedAt",
            ],
            object: updatedQuestion,
        });
    };

    static deleteQuestion = async (examId, questionId, teacherId) => {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to delete this question");
        }

        const questionToDelete = await questionRepo.findQuestionById(questionId);
        if (!questionToDelete) {
            throw new BadRequestError("Question not found");
        }

        const deletedQuestion = await questionRepo.deleteQuestion(questionId);
        if (!deletedQuestion) {
            throw new BadRequestError("Failed to delete question");
        }

        return { message: "Question deleted successfully" };
    };

    static listQuestions = async (filter = {}, teacherId, page, limit) => {
        const { exam: examId } = filter;
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        if (teacherId != null && examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to list a question on this exam");
        }

        const totalQuestions = await questionRepo.countQuestions(filter);
        const questions = await questionRepo.listQuestions(filter, page, limit);
        const totalPages = Math.ceil(totalQuestions / limit);
        return {
            total: totalQuestions,
            totalPages,
            questions: questions.map((question) =>
                getInfoData({
                    fields: [
                        "_id",
                        "questionText",
                        "questionType",
                        "questionScore",
                        "correctAnswer",
                        "options",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: question,
                }),
            ),
        };
    };

    static filterQuestions = async (query, page, limit, examId) => {
        const { totalQuestions, questions } = await questionRepo.filterQuestions(query, page, limit, examId);
        const totalPages = Math.ceil(totalQuestions / limit);

        return {
            total: totalQuestions,
            totalPages,
            questions: questions.map((question) =>
                getInfoData({
                    fields: [
                        "_id",
                        "questionText",
                        "questionType",
                        "questionScore",
                        "correctAnswer",
                        "options",
                        "exam",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: question,
                }),
            ),
        };
    };
}

module.exports = QuestionService;
