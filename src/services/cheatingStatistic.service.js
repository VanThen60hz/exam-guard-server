"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, ForbiddenError } = require("../core/error.response");

const cheatingStatisticRepo = require("../repo/cheatingStatistic.repo");
const examRepo = require("../repo/exam.repo");

class CheatingStatisticService {
    static async createCheatingStatistic(statisticData, examId, studentId) {
        if (!studentId || !examId) {
            throw new BadRequestError("Student ID and Exam ID are required");
        }

        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const newStatisticData = {
            ...statisticData,
            student: studentId,
            exam: examId,
        };

        const newCheatingStatistic = await cheatingStatisticRepo.createCheatingStatistic(newStatisticData);
        return getInfoData({
            fields: [
                "_id",
                "faceDetectionCount",
                "tabSwitchCount",
                "screenCaptureCount",
                "student",
                "exam",
                "createdAt",
                "updatedAt",
            ],
            object: newCheatingStatistic,
        });
    }

    static async findCheatingStatisticById(statisticId) {
        const cheatingStatistic = await cheatingStatisticRepo.findCheatingStatisticById(statisticId);
        if (!cheatingStatistic) {
            throw new BadRequestError("Cheating statistic not found");
        }
        return getInfoData({
            fields: [
                "_id",
                "faceDetectionCount",
                "tabSwitchCount",
                "screenCaptureCount",
                "student",
                "createdAt",
                "updatedAt",
            ],
            object: cheatingStatistic,
        });
    }

    static async listCheatingStatistics(page = 1, limit = 10, examId = null, teacherId) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        if (teacherId == null || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to list cheating statistics for this exam");
        }

        const filter = { exam: examId };
        const cheatingStatistics = await cheatingStatisticRepo.listCheatingStatistics(filter, page, limit);

        return cheatingStatistics.map((statistic) =>
            getInfoData({
                fields: [
                    "_id",
                    "faceDetectionCount",
                    "tabSwitchCount",
                    "screenCaptureCount",
                    "student",
                    "exam",
                    "createdAt",
                    "updatedAt",
                ],
                object: statistic,
            }),
        );
    }

    static async filterCheatingStatistics(query, page = 1, limit = 10, examId, teacherId) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        if (teacherId == null || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to filter cheating statistics for this exam");
        }

        const { totalCheatingStatistics, cheatingStatistics } = await cheatingStatisticRepo.filterCheatingStatistics(
            query,
            page,
            limit,
            { exam: examId },
        );

        const totalPages = Math.ceil(totalCheatingStatistics / limit);

        return {
            total: totalCheatingStatistics,
            totalPages,
            cheatingStatistics: cheatingStatistics.map((statistic) =>
                getInfoData({
                    fields: [
                        "_id",
                        "faceDetectionCount",
                        "tabSwitchCount",
                        "screenCaptureCount",
                        "student",
                        "exam",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: statistic,
                }),
            ),
        };
    }

    static async listCheatingStatisticsByStudentId(studentId, page = 1, limit = 10, examId = null) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = { student: studentId, exam: examId };

        const cheatingStatistics = await cheatingStatisticRepo.listCheatingStatistics(filter, page, limit);
        return cheatingStatistics.map((statistic) =>
            getInfoData({
                fields: [
                    "_id",
                    "faceDetectionCount",
                    "tabSwitchCount",
                    "screenCaptureCount",
                    "student",
                    "exam",
                    "createdAt",
                    "updatedAt",
                ],
                object: statistic,
            }),
        );
    }
}

module.exports = CheatingStatisticService;
