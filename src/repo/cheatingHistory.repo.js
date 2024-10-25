"use strict";
const cheatingHistoryModel = require("../models/cheatingHistory.model");

class CheatingHistoryRepo {
    constructor() {
        this.selectFields = {
            infractionType: 1,
            description: 1,
            timeDetected: 1,
            student: 1,
            exam: 1,
        };
    }

    static async createCheatingHistory(cheatingData) {
        return await cheatingHistoryModel.create(cheatingData);
    }

    static async findCheatingHistoryById(cheatingHistoryId, select = this.selectFields) {
        return await cheatingHistoryModel
            .findOne({
                _id: cheatingHistoryId,
            })
            .select(select)
            .populate("student", "_id username email name")
            .populate("exam", "_id title description")
            .lean();
    }

    static async updateCheatingHistory(cheatingHistoryId, cheatingData) {
        return await cheatingHistoryModel.findByIdAndUpdate(cheatingHistoryId, cheatingData, { new: true });
    }

    static async deleteCheatingHistory(cheatingHistoryId) {
        return await cheatingHistoryModel.findByIdAndDelete(cheatingHistoryId);
    }

    static async countCheatingHistories(filter = {}) {
        return await cheatingHistoryModel.countDocuments(filter);
    }

    static async listCheatingHistories(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        return await cheatingHistoryModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("student", "_id username email name")
            .lean();
    }

    static async filterCheatingHistories(query, page = 1, limit = 10, additionalFilter = {}) {
        const skip = (page - 1) * limit;
        const searchQuery = {
            ...additionalFilter,
            $or: [
                { infractionType: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        };

        const totalCheatingHistories = await cheatingHistoryModel.countDocuments(searchQuery);
        const cheatingHistories = await cheatingHistoryModel
            .find(searchQuery)
            .skip(skip)
            .limit(limit)
            .populate("student", "_id username email name")
            .populate("exam", "_id title description")
            .lean();

        return { totalCheatingHistories, cheatingHistories };
    }
}

module.exports = CheatingHistoryRepo;
