"use strict";
const cheatingStatisticModel = require("../models/cheatingStatistic.model");
const { Types } = require("mongoose");

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

        if (filter.exam && typeof filter.exam === "string") {
            filter.exam = new Types.ObjectId(`${filter.exam}`);
        }

        return await cheatingStatisticModel
            .aggregate([
                { $match: filter },
                {
                    $addFields: {
                        totalViolations: {
                            $sum: ["$faceDetectionCount", "$tabSwitchCount", "$screenCaptureCount"],
                        },
                    },
                },
                { $sort: { totalViolations: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "student",
                        foreignField: "_id",
                        as: "student",
                    },
                },
                {
                    $lookup: {
                        from: "exams",
                        localField: "exam",
                        foreignField: "_id",
                        as: "exam",
                    },
                },
                { $unwind: "$student" },
                { $unwind: "$exam" },
                {
                    $project: {
                        _id: 1,
                        faceDetectionCount: 1,
                        tabSwitchCount: 1,
                        screenCaptureCount: 1,
                        totalViolations: 1,
                        student: {
                            _id: 1,
                            username: 1,
                            email: 1,
                            name: 1,
                            avatar: 1,
                        },
                        exam: {
                            _id: 1,
                            title: 1,
                            description: 1,
                        },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ])
            .exec();
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

    static deleteByStudent = async (studentId, session) => {
        return cheatingStatisticModel.deleteMany({ student: studentId }).session(session);
    };
}

module.exports = CheatingStatisticRepo;
