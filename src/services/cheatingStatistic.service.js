"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, ForbiddenError } = require("../core/error.response");

const cheatingStatisticRepo = require("../repo/cheatingStatistic.repo");
const examRepo = require("../repo/exam.repo");
const { getInfractionHandler } = require("../strategies/InfractionStrategy");

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
        const totalStatistics = await cheatingStatisticRepo.countCheatingStatistics(filter); // Tính tổng số bản ghi
        const cheatingStatistics = await cheatingStatisticRepo.listCheatingStatistics(filter, page, limit);
        const totalPages = Math.ceil(totalStatistics / limit);

        return {
            total: totalStatistics,
            totalPages,
            cheatingStatistics: cheatingStatistics.map((statistic) =>
                getInfoData({
                    fields: [
                        "_id",
                        "faceDetectionCount",
                        "tabSwitchCount",
                        "screenCaptureCount",
                        "totalViolations",
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

    static async updateCheatingStatistic(cheatingData, examId, studentId) {
        const handler = getInfractionHandler(cheatingData.infractionType);

        let cheatingStatistic = await cheatingStatisticRepo.findCheatingStatisticByExamAndStudent(examId, studentId);

        if (!cheatingStatistic) {
            const initialStatisticData = {
                exam: examId,
                student: studentId,
                faceDetectionCount: 0,
                tabSwitchCount: 0,
                screenCaptureCount: 0,
                ...handler.getInitialData(),
            };

            cheatingStatistic = await cheatingStatisticRepo.createCheatingStatistic(initialStatisticData);
        } else {
            const updateData = handler.handleUpdate(cheatingStatistic);
            await cheatingStatisticRepo.updateCheatingStatistic(cheatingStatistic._id, updateData);
            cheatingStatistic = { ...cheatingStatistic._doc, ...updateData };
        }

        const populatedStatistic = await cheatingStatisticRepo.findCheatingStatisticById(cheatingStatistic._id);

        return getInfoData({
            fields: [
                "_id",
                "exam",
                "student",
                "faceDetectionCount",
                "tabSwitchCount",
                "screenCaptureCount",
                "createdAt",
                "updatedAt",
            ],
            object: populatedStatistic,
        });
    }
}

module.exports = CheatingStatisticService;
