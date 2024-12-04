"use strict";

const amqp = require("amqplib");
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const NotificationTypes = require("../constants/notificationType");

const notificationService = require("./notification.service");
const CheatingStatisticService = require("./cheatingStatistic.service");
const cheatingHistoryRepo = require("../repo/cheatingHistory.repo");
const examRepo = require("../repo/exam.repo");
const { cheatingResolve } = require("../resolvers/cheating.resolve");

class CheatingHistoryService {
    static async createCheatingHistory(cheatingData, examId, studentId) {
        await this._validateData(examId, studentId);

        const newCheatingHistory = await this._createHistoryEntry(cheatingData, examId, studentId);

        const teacherId = await examRepo.getTeacherId(examId);

        const cheatingStatistic = await CheatingStatisticService.updateCheatingStatistic(
            cheatingData,
            examId,
            studentId,
        );

        cheatingResolve(cheatingStatistic, teacherId);

        const notificationData = await cheatingHistoryRepo.findCheatingHistoryById(newCheatingHistory._id);

        await notificationService.pushNotification({
            type: NotificationTypes.CHEATING_NEW,
            receivedId: teacherId,
            senderId: studentId,
            options: {
                studentName: notificationData?.student?.username,
                infractionType: notificationData?.infractionType,
                examTitle: notificationData?.exam?.title,
            },
        });

        return getInfoData({
            fields: ["_id", "infractionType", "description", "student", "exam", "timeDetected", "updatedAt"],
            object: newCheatingHistory,
        });
    }

    static async _validateData(examId, studentId) {
        if (!studentId || !examId) {
            throw new BadRequestError("Student ID and Exam ID are required");
        }

        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }
    }

    static async _createHistoryEntry(cheatingData, examId, studentId) {
        const newCheatingHistoryData = {
            ...cheatingData,
            student: studentId,
            exam: examId,
        };

        return await cheatingHistoryRepo.createCheatingHistory(newCheatingHistoryData);
    }

    static async findCheatingHistoryById(cheatingHistoryId) {
        const cheatingHistory = await cheatingHistoryRepo.findCheatingHistoryById(cheatingHistoryId);
        if (!cheatingHistory) {
            throw new BadRequestError("Cheating history not found");
        }
        return getInfoData({
            fields: ["_id", "infractionType", "description", "student", "exam", "timeDetected", "updatedAt"],
            object: cheatingHistory,
        });
    }

    static async listCheatingHistories(page = 1, limit = 10, examId = null, teacherId) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        if (teacherId == null || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to list a cheating history on this exam");
        }

        const filter = { exam: examId };
        const cheatingHistories = await cheatingHistoryRepo.listCheatingHistories(filter, page, limit);

        return cheatingHistories.map((cheatingHistory) =>
            getInfoData({
                fields: ["_id", "infractionType", "description", "student", "exam", "timeDetected", "updatedAt"],
                object: cheatingHistory,
            }),
        );
    }

    static async filterCheatingHistories(query, page = 1, limit = 10, examId, teacherId) {
        const examToCheck = examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        if (teacherId == null || examToCheck.teacher._id.toString() !== teacherId) {
            throw new ForbiddenError("You are not authorized to list a cheating history on this exam");
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
                    fields: ["_id", "infractionType", "description", "student", "exam", "timeDetected", "updatedAt"],
                    object: cheatingHistory,
                }),
            ),
        };
    }

    static async listCheatingHistoriesByStudentId(
        studentId,
        page = 1,
        limit = 10,
        examId = null,
        infractionType = null,
    ) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = { student: studentId, exam: examId };
        if (infractionType) {
            filter.infractionType = infractionType;
        }

        const totalCheatingHistories = await cheatingHistoryRepo.countCheatingHistories(filter);
        const cheatingHistories = await cheatingHistoryRepo.listCheatingHistories(filter, page, limit);
        const totalPages = Math.ceil(totalCheatingHistories / limit);

        return {
            total: totalCheatingHistories,
            totalPages,
            cheatingHistories: cheatingHistories.map((cheatingHistory) =>
                getInfoData({
                    fields: ["_id", "infractionType", "description", "student", "exam", "timeDetected", "updatedAt"],
                    object: cheatingHistory,
                }),
            ),
        };
    }
}

module.exports = CheatingHistoryService;
