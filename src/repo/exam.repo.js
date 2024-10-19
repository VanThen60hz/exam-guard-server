"use strict";
const examModel = require("../models/exam.model");

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
            .populate("teacher")
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
        return await examModel.find(filter).skip(skip).limit(limit).populate("teacher").lean();
    }

    static async filterExams(query, page = 1, limit = 10, additionalFilter = {}) {
        const skip = (page - 1) * limit;
        const isDate = /^\d{4}-\d{2}-\d{2}$/.test(query);

        const searchQuery = {
            ...additionalFilter,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                ...(isDate ? [{ startTime: query }, { endTime: query }] : []),
                { status: { $regex: query, $options: "i" } },
            ],
        };

        const totalExams = await examModel.countDocuments(searchQuery);
        const exams = await examModel.find(searchQuery).skip(skip).limit(limit).populate("teacher").lean();

        return { totalExams, exams };
    }
}

module.exports = ExamRepo;
