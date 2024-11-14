"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const examRepo = require("../repo/exam.repo");
const gradeRepo = require("../repo/grade.repo");
const questionRepo = require("../repo/question.repo");
const answerRepo = require("../repo/answer.repo");

class ExamService {
    static findExamById = async (examId, userId) => {
        const exam = await examRepo.findExamById(examId);

        if (!exam) {
            throw new BadRequestError("Exam not found");
        }

        if (exam.teacher._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this exam");
        }

        return getInfoData({
            fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "teacher", "question", "createdAt", "updatedAt"],
            object: exam,
        });
    };

    static createExam = async (req) => {
        const teacherId = req.userId;
        if (!teacherId) {
            throw new UnauthorizedError("You are not authorized to create an exam");
        }

        const examData = {
            ...req.body,
            teacher: teacherId,
        };

        const newExam = await examRepo.createExam(examData);
        return getInfoData({
            fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "question", "createdAt", "updatedAt"],
            object: newExam,
        });
    };

    static updateExam = async (examId, examData, userId) => {
        const examToUpdate = await examRepo.findExamById(examId);
        if (!examToUpdate) {
            throw new BadRequestError("Exam not found");
        }

        if (examToUpdate.teacher._id.toString() !== userId) {
            throw new ForbiddenError("You do not have permission to update this exam");
        }

        const updatedExam = await examRepo.updateExam(examId, examData);
        if (!updatedExam) {
            throw new BadRequestError("Failed to update exam");
        }

        return getInfoData({
            fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "question", "createdAt", "updatedAt"],
            object: updatedExam,
        });
    };

    static deleteExam = async (examId) => {
        const deletedExam = await examRepo.deleteExam(examId);
        if (!deletedExam) {
            throw new BadRequestError("Exam not found");
        }
        return { message: "Exam deleted successfully" };
    };

    static listExamsForStudent = async (filter = {}, page, limit) => {
        const totalExams = await examRepo.countExams(filter);
        const exams = await examRepo.listExams(filter, page, limit);
        const totalPages = Math.ceil(totalExams / limit);
        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "questionCount", "teacher", "createdAt", "updatedAt"],
                    object: exam,
                }),
            ),
        };
    };

    static listExamsForTeacher = async (filter = {}, page, limit) => {
        const totalExams = await examRepo.countExams(filter);
        const exams = await examRepo.listExams(filter, page, limit);
        const totalPages = Math.ceil(totalExams / limit);
        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: ["_id", "title", "description", "startTime", "endTime", "duration", "questionCount", "status", "createdAt", "updatedAt"],
                    object: exam,
                }),
            ),
        };
    };

    static async filterExamsForTeacher(filter, page = 1, limit = 10) {
        const { query, teacher: teacherId, status } = filter;

        const additionalFilter = { teacher: teacherId };
        if (status !== undefined) {
            additionalFilter.status = status;
        }

        const { totalExams, exams } = await examRepo.filterExams(query, page, limit, additionalFilter);

        const totalPages = Math.ceil(totalExams / limit);

        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "questionCount", "teacher", "createdAt", "updatedAt"],
                    object: exam,
                }),
            ),
        };
    }

    static async filterExamsForStudent(filter, page = 1, limit = 10) {
        const { query, status } = filter;

        const { totalExams, exams } = await examRepo.filterExams(query, page, limit, { status });

        const totalPages = Math.ceil(totalExams / limit);

        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: ["_id", "title", "description", "startTime", "endTime", "duration", "status", "questionCount", "teacher", "createdAt", "updatedAt"],
                    object: exam,
                }),
            ),
        };
    }

    static completeExam = async (examId, userId) => {
        const exam = await examRepo.findExamById(examId);
        if (!exam) {
            throw new BadRequestError("Exam not found");
        }

        if (exam.teacher._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to complete this exam");
        }

        const completedExam = await examRepo.completeExam(examId);
        if (!completedExam) {
            throw new BadRequestError("Failed to complete exam");
        }

        return { message: "Exam completed successfully" };
    };

    static async submitExam(examId, studentId, answers) {
        const exam = await this.validateExamAndStudent(examId, studentId);

        answers = this.normalizeAnswers(answers);

        await this.checkIfAlreadySubmitted(examId, studentId);

        const questions = await this.fetchQuestions(examId);
        const existingAnswersMap = await this.getExistingAnswersMap(studentId, questions);

        const { newAnswers, updatedAnswers, score } = this.calculateAnswersAndScore(answers, questions, existingAnswersMap, studentId);

        await this.saveAnswers(newAnswers, updatedAnswers);

        const newGrade = await this.createGrade(studentId, examId, score);

        return { message: "Exam submitted successfully", newGrade };
    }

    static async validateExamAndStudent(examId, studentId) {
        const exam = await examRepo.findExamById(examId);
        if (!exam) {
            throw new BadRequestError("Exam not found");
        }
        if (exam.teacher._id.toString() === studentId) {
            throw new UnauthorizedError("Teachers cannot submit exams");
        }
        return exam;
    }

    static normalizeAnswers(answers) {
        return answers && answers.length > 0 ? answers : [];
    }

    static async checkIfAlreadySubmitted(examId, studentId) {
        const existingGrade = await gradeRepo.findGradeByStudentAndExam(studentId, examId);
        if (existingGrade) {
            throw new BadRequestError("You have already submitted this exam.");
        }
    }

    static async fetchQuestions(examId) {
        const questions = await questionRepo.findQuestionsByExam(examId);
        if (!questions || questions.length === 0) {
            throw new BadRequestError("No questions found for this exam");
        }
        return questions;
    }

    static async getExistingAnswersMap(studentId, questions) {
        const questionIds = questions.map((q) => q._id);
        const existingAnswers = await answerRepo.findAnswersByStudentAndQuestions(studentId, questionIds);
        return existingAnswers.reduce((map, ans) => {
            map[ans.question.toString()] = ans;
            return map;
        }, {});
    }

    static calculateAnswersAndScore(answers, questions, existingAnswersMap, studentId) {
        const newAnswers = [];
        const updatedAnswers = [];
        const score = questions.reduce((total, questionData) => {
            const submittedAnswer = answers.find((a) => a.question.toString() === questionData._id.toString());
            const existingAnswer = existingAnswersMap[questionData._id.toString()];

            let isCorrect = false;
            let answerText = "";

            if (submittedAnswer) {
                answerText = submittedAnswer.answer;
                isCorrect = questionData.correctAnswer === submittedAnswer.answer;

                const answerData = {
                    answerText,
                    isCorrect,
                    question: questionData._id,
                    student: studentId,
                };

                if (existingAnswer) {
                    existingAnswer.answerText = answerData.answerText;
                    existingAnswer.isCorrect = answerData.isCorrect;
                    updatedAnswers.push(existingAnswer);
                } else {
                    newAnswers.push(answerData);
                }
            } else if (existingAnswer) {
                answerText = existingAnswer.answerText;
                isCorrect = existingAnswer.isCorrect;
            }

            return isCorrect ? total + questionData.questionScore : total;
        }, 0);

        return { newAnswers, updatedAnswers, score };
    }

    static async saveAnswers(newAnswers, updatedAnswers) {
        if (newAnswers.length > 0) {
            await answerRepo.insertManyAnswers(newAnswers);
        }

        if (updatedAnswers.length > 0) {
            await Promise.all(updatedAnswers.map((answer) => answerRepo.updateAnswer(answer)));
        }
    }

    static async createGrade(studentId, examId, score) {
        return await gradeRepo.createGrade({
            student: studentId,
            exam: examId,
            score,
            feedback: "Exam graded successfully",
        });
    }
}

module.exports = ExamService;
