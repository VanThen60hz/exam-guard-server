"use strict";
const answerModel = require("../models/answer.model");
const questionModel = require("../models/question.model");

class AnswerRepo {
    constructor() {
        this.selectFields = {
            answerText: 1,
            isCorrect: 1,
            question: 1,
            student: 1,
        };
    }

    static async createAnswer(answerData) {
        return await answerModel.create(answerData);
    }

    static async findAnswerById(answerId, select = this.selectFields) {
        return await answerModel
            .findOne({
                _id: answerId,
            })
            .select(select)
            .populate("question", "questionText questionScore correctAnswer")
            .populate("student", "_id username email name")
            .lean();
    }

    static findAnswerByStudentAndQuestion = async (studentId, questionId) => {
        const answer = await answerModel.findOne({
            student: studentId,
            question: questionId,
        });
        return answer;
    };

    static async updateAnswer(answerId, answerData) {
        return await answerModel.findByIdAndUpdate(answerId, answerData, { new: true });
    }

    static async deleteAnswer(answerId) {
        return await answerModel.findByIdAndDelete(answerId);
    }

    static async listAnswersByExam(studentId, examId) {
        const questions = await questionModel
            .find({
                exam: examId,
            })
            .select({ _id: 1 })
            .lean();

        const questionIds = questions.map((q) => q._id);

        return await answerModel
            .find({
                student: studentId,
                question: { $in: questionIds },
            })
            .populate("question")
            .lean();
    }

    static async calculateScoreByQuestion(studentId, examId) {
        const answers = await this.listAnswersByExam(studentId, examId);
        let totalScore = 0;

        answers.forEach((answer) => {
            if (answer.isCorrect) {
                totalScore += answer.question.questionScore;
            }
        });

        return totalScore;
    }

    static async countAnswers(filter = {}) {
        return await answerModel.countDocuments(filter);
    }

    static async listAnswers(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await answerModel.find(filter).skip(skip).limit(limit).lean();
    }
}

module.exports = AnswerRepo;
