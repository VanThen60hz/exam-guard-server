"use strict";

const { SuccessResponse } = require("../core/success.response");
const cheatingStatisticService = require("../services/cheatingStatistic.service");

class CheatingStatisticController {
    getCheatingStatisticById = async (req, res, next) => {
        const { id } = req.params;
        const cheatingStatistic = await cheatingStatisticService.findCheatingStatisticById(id);

        new SuccessResponse({
            message: "Cheating statistic retrieved successfully",
            metadata: cheatingStatistic,
        }).send(res);
    };

    recordCheatingStatistic = async (req, res, next) => {
        const { examId } = req.params;
        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const studentId = req.userId;
        if (!studentId) {
            new UnauthorizedError("Unauthorized").send(res);
        }

        const statisticData = req.body;
        const newCheatingStatistic = await cheatingStatisticService.createCheatingStatistic(
            statisticData,
            examId,
            studentId,
        );

        new SuccessResponse({
            message: "Cheating statistic created successfully",
            metadata: newCheatingStatistic,
        }).send(res);
    };

    listCheatingStatistics = async (req, res, next) => {
        const { examId } = req.params;
        const teacherId = req.userId;

        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const { page = 1, limit = 10 } = req.query;
        const cheatingStatistics = await cheatingStatisticService.listCheatingStatistics(
            page,
            limit,
            examId,
            teacherId,
        );

        new SuccessResponse({
            message: "List of cheating statistics retrieved successfully",
            metadata: {
                total: cheatingStatistics.length,
                cheatingStatistics,
            },
        }).send(res);
    };

    filterCheatingStatistics = async (req, res, next) => {
        const { examId } = req.params;
        const teacherId = req.userId;

        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const { query, page = 1, limit = 10 } = req.query;
        const response = await cheatingStatisticService.filterCheatingStatistics(query, page, limit, examId, teacherId);

        new SuccessResponse({
            message: "Filtered list of cheating statistics retrieved successfully",
            metadata: {
                total: response.total,
                totalPages: response.totalPages,
                cheatingStatistics: response.cheatingStatistics,
            },
        }).send(res);
    };

    listCheatingStatisticsByStudentId = async (req, res, next) => {
        const { studentId, examId } = req.params;

        if (!studentId) {
            new BadRequestError("Student ID is required").send(res);
        }

        if (!examId) {
            new BadRequestError("Exam ID is required").send(res);
        }

        const { page = 1, limit = 10 } = req.query;
        const cheatingStatistics = await cheatingStatisticService.listCheatingStatisticsByStudentId(
            studentId,
            page,
            limit,
            examId,
        );

        new SuccessResponse({
            message: "List of cheating statistics for student retrieved successfully",
            metadata: {
                total: cheatingStatistics.length,
                cheatingStatistics,
            },
        }).send(res);
    };
}

module.exports = new CheatingStatisticController();
