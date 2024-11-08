"use strict";

const amqp = require("amqplib");
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");

const CheatingStatisticService = require("./cheatingStatistic.service");
const cheatingHistoryRepo = require("../repo/cheatingHistory.repo");
const cheatingStatisticRepo = require("../repo/cheatingStatistic.repo");
const examRepo = require("../repo/exam.repo");
const { cheatingResolve } = require("../resolvers/cheating.resolve");

class CheatingHistoryService {
    static async createCheatingHistory(cheatingData, examId, studentId) {
        // Bước 1: Xác thực dữ liệu
        await this.validateData(examId, studentId);

        // Bước 2: Cập nhật hoặc tạo thống kê gian lận
        const cheatingStatistic = await CheatingStatisticService.updateCheatingStatistic(
            cheatingData,
            examId,
            studentId,
        );

        // Bước 3: Tạo bản ghi lịch sử gian lận
        const newCheatingHistory = await this.createHistoryEntry(cheatingData, examId, studentId);

        // Bước 4: Gửi thông báo qua RabbitMQ với dữ liệu Cheating Statistic
        await cheatingResolve(cheatingStatistic);

        return getInfoData({
            fields: ["_id", "infractionType", "description", "student", "exam", "createdAt", "updatedAt"],
            object: newCheatingHistory,
        });
    }

    static async validateData(examId, studentId) {
        if (!studentId || !examId) {
            throw new BadRequestError("Student ID and Exam ID are required");
        }

        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }
    }

    static async createHistoryEntry(cheatingData, examId, studentId) {
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
            fields: ["_id", "infractionType", "description", "timeDetected", "student", "createdAt", "updatedAt"],
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
                fields: ["_id", "infractionType", "description", "student", "examId", "createdAt", "updatedAt"],
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
                    fields: ["_id", "infractionType", "description", "student", "examId", "createdAt", "updatedAt"],
                    object: cheatingHistory,
                }),
            ),
        };
    }

    static async listCheatingHistoriesByStudentId(studentId, page = 1, limit = 10, examId = null) {
        const examToCheck = await examRepo.findExamById(examId);
        if (!examToCheck) {
            throw new BadRequestError("Exam not found");
        }

        const filter = { student: studentId, exam: examId };

        const cheatingHistories = await cheatingHistoryRepo.listCheatingHistories(filter, page, limit);
        return cheatingHistories.map((cheatingHistory) =>
            getInfoData({
                fields: ["_id", "infractionType", "description", "student", "examId", "createdAt", "updatedAt"],
                object: cheatingHistory,
            }),
        );
    }
}

module.exports = CheatingHistoryService;
