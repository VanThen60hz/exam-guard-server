"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const questionRepo = require("../repo/question.repo");
const answerRepo = require("../repo/answer.repo");

class AnswerService {
    static findAnswerById = async (answerId, userId) => {
        const answer = await answerRepo.findAnswerById(answerId);
        if (!answer) {
            throw new BadRequestError("Answer not found");
        }

        if (answer.student._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this answer");
        }

        return getInfoData({
            fields: ["_id", "answerText", "isCorrect", "question", "student", "createdAt", "updatedAt"],
            object: answer,
        });
    };

    static answerQuestion = async (req, questionId, studentId) => {
        if (!studentId) {
            throw new UnauthorizedError("You are not authorized to submit an answer");
        }

        if (!questionId) {
            throw new BadRequestError("Question ID is required");
        }

        const question = await questionRepo.findQuestionById(questionId);
        if (!question) {
            throw new BadRequestError("Question not found");
        }

        const { answerText } = req.body;
        if (!answerText) {
            throw new BadRequestError("Answer text is required");
        }

        const existingAnswer = await answerRepo.findAnswerByStudentAndQuestion(studentId, questionId);

        if (existingAnswer) {
            if (existingAnswer.answerText === answerText) {
                await answerRepo.deleteAnswer(existingAnswer._id);
                return {
                    message: "Answer deleted because it was the same as the previous answer.",
                };
            } else {
                await answerRepo.deleteAnswer(existingAnswer._id);
                const isCorrect = question.correctAnswer === answerText;

                const newAnswerData = {
                    answerText,
                    isCorrect,
                    student: studentId,
                    question: questionId,
                };

                const newAnswer = await answerRepo.createAnswer(newAnswerData);

                return getInfoData({
                    fields: ["_id", "answerText", "isCorrect", "createdAt", "updatedAt"],
                    object: newAnswer,
                });
            }
        }

        const isCorrect = question.correctAnswer === answerText;

        const answerData = {
            answerText,
            isCorrect,
            student: studentId,
            question: questionId,
        };

        const newAnswer = await answerRepo.createAnswer(answerData);

        return getInfoData({
            fields: ["_id", "answerText", "isCorrect", "createdAt", "updatedAt"],
            object: newAnswer,
        });
    };

    static listAnswersByQuestion = async (questionId, page = 1, limit = 10) => {
        if (!questionId) {
            throw new BadRequestError("Question ID is required");
        }

        const filter = { question: questionId };
        const totalAnswers = await answerRepo.countAnswers(filter);
        const answers = await answerRepo.listAnswers(filter, page, limit);
        const totalPages = Math.ceil(totalAnswers / limit);

        return {
            total: totalAnswers,
            totalPages,
            answers: answers.map((answer) =>
                getInfoData({
                    fields: ["_id", "answerText", "isCorrect", "question", "student", "createdAt", "updatedAt"],
                    object: answer,
                }),
            ),
        };
    };

    static listAnswersByStudent = async (studentId, examId, page = 1, limit = 10) => {
        if (!studentId || !examId) {
            throw new BadRequestError("Student ID and Exam ID are required");
        }

        const examQuestions = await questionRepo.findQuestionsByExam(examId);
        console.log("Exam Questions:", examQuestions);

        if (!Array.isArray(examQuestions)) {
            throw new Error("Expected examQuestions to be an array");
        }

        const questionIds = examQuestions.map((question) => question._id);

        const filter = { student: studentId, question: { $in: questionIds } };

        const totalAnswers = await answerRepo.countAnswers(filter);

        const answers = await answerRepo.listAnswers(filter, page, limit);

        const totalPages = Math.ceil(totalAnswers / limit);

        return {
            total: totalAnswers,
            totalPages,
            answers: answers.map((answer) =>
                getInfoData({
                    fields: ["_id", "answerText", "isCorrect", "question", "student", "createdAt", "updatedAt"],
                    object: answer,
                }),
            ),
        };
    };
}

module.exports = AnswerService;
