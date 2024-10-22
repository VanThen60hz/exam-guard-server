"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const cheatingHistoryRepo = require("../repo/cheatingHistory.repo");
const examRepo = require("../repo/exam.repo");

class CheatingHistoryService {
    static async createCheatingHistory(cheatingData, examId, studentId) {
        if (!studentId || !examId) {
            throw new BadRequestError("Student ID and Exam ID are required");
        }
        const newCheatingHistoryData = {
            ...cheatingData,
            student: studentId,
            exam: examId,
        };

        const newCheatingHistory = await cheatingHistoryRepo.createCheatingHistory(newCheatingHistoryData);
        return getInfoData({
            fields: [
                "_id",
                "infractionType",
                "description",
                "timeDetected",
                "student",
                "exam",
                "createdAt",
                "updatedAt",
            ],
            object: newCheatingHistory,
        });
    }

    static async findCheatingHistoryById(cheatingHistoryId) {
        const cheatingHistory = await cheatingHistoryRepo.findCheatingHistoryById(cheatingHistoryId);
        if (!cheatingHistory) {
            throw new BadRequestError("Cheating history not found");
        }
        return getInfoData({
            fields: ["_id", "infractionType", "description", "timeDetected", "student", "createdAt", "updatedAt"],
            object: cheatingHistory,
        });
    }

    static async listCheatingHistories(page = 1, limit = 10, examId = null) {
        const examToCheck = examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = examId;
        const cheatingHistories = await cheatingHistoryRepo.listCheatingHistories(filter, page, limit);
        return cheatingHistories.map((cheatingHistory) =>
            getInfoData({
                fields: [
                    "_id",
                    "infractionType",
                    "description",
                    "timeDetected",
                    "student",
                    "examId",
                    "createdAt",
                    "updatedAt",
                ],
                object: cheatingHistory,
            }),
        );
    }

    static async filterCheatingHistories(query, page = 1, limit = 10, examId) {
        const examToCheck = examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = { ...query };
        if (query.examId) {
            filter.examId = query.examId;
        }

        const { totalCheatingHistories, cheatingHistories } = await cheatingHistoryRepo.filterCheatingHistories(
            filter,
            page,
            limit,
            { examId },
        );

        const totalPages = Math.ceil(totalCheatingHistories / limit);

        return {
            total: totalCheatingHistories,
            totalPages,
            cheatingHistories: cheatingHistories.map((cheatingHistory) =>
                getInfoData({
                    fields: [
                        "_id",
                        "infractionType",
                        "description",
                        "timeDetected",
                        "student",
                        "examId",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: cheatingHistory,
                }),
            ),
        };
    }

    static async listCheatingHistoriesByStudentId(studentId, page = 1, limit = 10, examId = null) {
        const examToCheck = examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = { student: studentId, exam: examId };

        const cheatingHistories = await cheatingHistoryRepo.listCheatingHistories(filter, page, limit);
        return cheatingHistories.map((cheatingHistory) =>
            getInfoData({
                fields: [
                    "_id",
                    "infractionType",
                    "description",
                    "timeDetected",
                    "student",
                    "examId",
                    "createdAt",
                    "updatedAt",
                ],
                object: cheatingHistory,
            }),
        );
    }
}

module.exports = CheatingHistoryService;
