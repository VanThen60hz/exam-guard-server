"use strict";

const { SuccessResponse } = require("../core/success.response");
const cheatingHistoryService = require("../services/cheatingHistory.service");

class CheatingHistoryController {
    getCheatingHistoryById = async (req, res, next) => {
        const { id } = req.params;
        const cheatingHistory = await cheatingHistoryService.findCheatingHistoryById(id);

        new SuccessResponse({
            message: "Cheating history retrieved successfully",
            metadata: cheatingHistory,
        }).send(res);
    };

    detectCheating = async (req, res, next) => {
        const { examId } = req.params;
        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const studentId = req.userId;
        if (!studentId) {
            new UnauthorizedError("Unauthorized").send(res);
        }

        const cheatingData = req.body;
        const newCheatingHistory = await cheatingHistoryService.createCheatingHistory(cheatingData, examId, studentId);

        new SuccessResponse({
            message: "Cheating history created successfully",
            metadata: newCheatingHistory,
        }).send(res);
    };

    listCheatingHistories = async (req, res, next) => {
        const { examId } = req.params;

        const teacherId = req.userId;

        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }
        const { page = 1, limit = 10 } = req.query;
        const cheatingHistories = await cheatingHistoryService.listCheatingHistories(page, limit, examId, teacherId);

        new SuccessResponse({
            message: "List of cheating histories retrieved successfully",
            metadata: {
                total: cheatingHistories.length,
                cheatingHistories,
            },
        }).send(res);
    };

    filterCheatingHistories = async (req, res, next) => {
        const { examId } = req.params;
        const teacherId = req.userId;
        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const { query, page = 1, limit = 10 } = req.query;
        const response = await cheatingHistoryService.filterCheatingHistories(query, page, limit, examId, teacherId);

        new SuccessResponse({
            message: "Filtered list of cheating histories retrieved successfully",
            metadata: {
                total: response.total,
                totalPages: response.totalPages,
                cheatingHistories: response.cheatingHistories,
            },
        }).send(res);
    };

    listCheatingHistoriesByStudentId = async (req, res, next) => {
        const { studentId, examId } = req.params;
        if (!studentId) {
            new BadRequestError("Student ID is required").send(res);
        }

        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const { page = 1, limit = 10 } = req.query;
        const cheatingHistories = await cheatingHistoryService.listCheatingHistoriesByStudentId(
            studentId,
            page,
            limit,
            examId,
        );

        new SuccessResponse({
            message: "List of cheating histories for student retrieved successfully",
            metadata: {
                total: cheatingHistories.length,
                cheatingHistories,
            },
        }).send(res);
    };
}

module.exports = new CheatingHistoryController();
