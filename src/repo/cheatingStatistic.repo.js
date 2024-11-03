"use strict";
const cheatingStatisticModel = require("../models/cheatingStatistic.model");

class CheatingStatisticRepo {
    constructor() {
        this.selectFields = {
            faceDetectionCount: 1,
            tabSwitchCount: 1,
            screenCaptureCount: 1,
            exam: 1,
            student: 1,
        };
    }

    static async createCheatingStatistic(statisticData) {
        return await cheatingStatisticModel.create(statisticData);
    }

    static async findCheatingStatisticById(statisticId, select = this.selectFields) {
        return await cheatingStatisticModel
            .findOne({ _id: statisticId })
            .select(select)
            .populate("student", "_id username email name avatar")
            .populate("exam", "_id title description")
            .lean();
    }

    static async findCheatingStatisticByExamAndStudent(examId, studentId) {
        return await cheatingStatisticModel.findOne({ exam: examId, student: studentId });
    }

    static async updateCheatingStatistic(statisticId, statisticData) {
        return await cheatingStatisticModel.findByIdAndUpdate(statisticId, statisticData, { new: true });
    }

    static async deleteCheatingStatistic(statisticId) {
        return await cheatingStatisticModel.findByIdAndDelete(statisticId);
    }

    static async countCheatingStatistics(filter = {}) {
        return await cheatingStatisticModel.countDocuments(filter);
    }

    static async listCheatingStatistics(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        return await cheatingStatisticModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("student", "_id username email name avatar")
            .populate("exam", "_id title description")
            .lean();
    }

    static async filterCheatingStatistics(query, page = 1, limit = 10, additionalFilter = {}) {
        const skip = (page - 1) * limit;
        const searchQuery = {
            ...additionalFilter,
            $or: [{ faceDetectionCount: query }, { tabSwitchCount: query }, { screenCaptureCount: query }],
        };

        const totalCheatingStatistics = await cheatingStatisticModel.countDocuments(searchQuery);
        const cheatingStatistics = await cheatingStatisticModel
            .find(searchQuery)
            .skip(skip)
            .limit(limit)
            .populate("student", "_id username email name avatar")
            .populate("exam", "_id title description")
            .lean();

        return { totalCheatingStatistics, cheatingStatistics };
    }
}

module.exports = CheatingStatisticRepo;
