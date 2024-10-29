"use strict";
const { add } = require("lodash");
const examModel = require("../models/exam.model");
const questionRepo = require("./question.repo");

class ExamRepo {
    constructor() {
        this.selectFields = {
            teacher: 1,
            title: 1,
            description: 1,
            startTime: 1,
            endTime: 1,
            status: 1,
            question: 1,
        };
    }

    static async createExam(examData) {
        return await examModel.create(examData);
    }

    static async findExamById(examId, select = this.selectFields) {
        return await examModel
            .findOne({
                _id: examId,
            })
            .select(select)
            .populate("teacher", "_id username email name")
            .lean();
    }

    static async updateExam(examId, examData) {
        return await examModel.findByIdAndUpdate(examId, examData, { new: true });
    }

    static async deleteExam(examId) {
        return await examModel.findByIdAndDelete(examId);
    }

    static async countExams(filter = {}) {
        return await examModel.countDocuments(filter);
    }

    static async listExams(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const exams = await examModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("teacher", "_id username email name")
            .lean();

        const examsWithQuestionCount = await Promise.all(
            exams.map(async (exam) => {
                const questionCount = await questionRepo.countQuestions({ exam: exam._id });
                return { ...exam, questionCount };
            }),
        );

        return examsWithQuestionCount;
    }

    static async filterExams(query, page = 1, limit = 10, additionalFilter = {}) {
        const skip = (page - 1) * limit;
        const searchQuery = {
            ...additionalFilter,
            $or: [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }],
        };

        const totalExams = await examModel.countDocuments(searchQuery);
        const exams = await examModel
            .find(searchQuery)
            .skip(skip)
            .limit(limit)
            .populate("teacher", "_id username email name")
            .lean();

        // For each exam, get the question count using questionRepo
        const examsWithQuestionCount = await Promise.all(
            exams.map(async (exam) => {
                const questionCount = await questionRepo.countQuestions({ exam: exam._id });
                return { ...exam, questionCount };
            }),
        );

        return { totalExams, exams: examsWithQuestionCount };
    }
}

module.exports = ExamRepo;
