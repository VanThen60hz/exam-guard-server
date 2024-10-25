"use strict";
const questionModel = require("../models/question.model");

class QuestionRepo {
    constructor() {
        this.selectFields = {
            exam: 1,
            questionText: 1,
            questionType: 1,
            questionScore: 1,
            correctAnswer: 1,
            options: 1,
        };
    }

    static async createQuestion(questionData) {
        return await questionModel.create(questionData);
    }

    static async findQuestionById(questionId, select = this.selectFields) {
        return await questionModel
            .findOne({
                _id: questionId,
            })
            .select(select)
            .populate("exam", "_id title description")
            .lean();
    }

    static async updateQuestion(questionId, questionData) {
        return await questionModel.findByIdAndUpdate(questionId, questionData, { new: true });
    }

    static async deleteQuestion(questionId) {
        return await questionModel.findByIdAndDelete(questionId);
    }

    static async countQuestions(filter = {}) {
        return await questionModel.countDocuments(filter);
    }

    static async listQuestions(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await questionModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("exam", "_id title description")
            .lean();
    }

    static async findQuestionsByExam(examId) {
        const questions = await questionModel.find({ exam: examId }).lean();
        return questions;
    }

    static async filterQuestions(query, page = 1, limit = 10, examId) {
        const skip = (page - 1) * limit;

        const searchQuery = {
            exam: examId,
            $or: [
                { questionText: { $regex: query, $options: "i" } },
                { questionType: { $regex: query, $options: "i" } },
            ],
        };

        const totalQuestions = await questionModel.countDocuments(searchQuery);
        const questions = await questionModel.find(searchQuery).skip(skip).limit(limit).lean();

        return { totalQuestions, questions };
    }
}

module.exports = QuestionRepo;
