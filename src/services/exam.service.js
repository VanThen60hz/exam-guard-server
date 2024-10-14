"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const examRepo = require("../repo/exam.repo");

class ExamService {
    static findExamById = async (examId, userId) => {
        const exam = await examRepo.findExamById(examId);

        if (!exam) {
            throw new BadRequestError("Exam not found");
        }

        if (exam.teacher._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this exam");
        }

        return getInfoData({
            fields: [
                "_id",
                "title",
                "description",
                "startTime",
                "endTime",
                "status",
                "teacher",
                "question",
                "createdAt",
                "updatedAt",
            ],
            object: exam,
        });
    };

    static createExam = async (req) => {
        const teacherId = req.userId;
        if (!teacherId) {
            throw new UnauthorizedError("You are not authorized to create an exam");
        }

        const examData = {
            ...req.body,
            teacher: teacherId,
        };

        const newExam = await examRepo.createExam(examData);
        return getInfoData({
            fields: [
                "_id",
                "title",
                "description",
                "startTime",
                "endTime",
                "status",
                "question",
                "createdAt",
                "updatedAt",
            ],
            object: newExam,
        });
    };

    static updateExam = async (examId, examData, userId) => {
        const examToUpdate = await examRepo.findExamById(examId);
        if (!examToUpdate) {
            throw new BadRequestError("Exam not found");
        }

        if (examToUpdate.teacher._id.toString() !== userId) {
            throw new ForbiddenError("You do not have permission to update this exam");
        }

        const updatedExam = await examRepo.updateExam(examId, examData);
        if (!updatedExam) {
            throw new BadRequestError("Failed to update exam");
        }

        return getInfoData({
            fields: [
                "_id",
                "title",
                "description",
                "startTime",
                "endTime",
                "status",
                "question",
                "createdAt",
                "updatedAt",
            ],
            object: updatedExam,
        });
    };

    static deleteExam = async (examId) => {
        const deletedExam = await examRepo.deleteExam(examId);
        if (!deletedExam) {
            throw new BadRequestError("Exam not found");
        }
        return { message: "Exam deleted successfully" };
    };

    static listExams = async (filter = {}, page, limit) => {
        const totalExams = await examRepo.countExams(filter);
        const exams = await examRepo.listExams(filter, page, limit);
        const totalPages = Math.ceil(totalExams / limit);
        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: [
                        "_id",
                        "title",
                        "description",
                        "startTime",
                        "endTime",
                        "status",
                        "teacher",
                        "question",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: exam,
                }),
            ),
        };
    };

    static listExamForTeacher = async (teacherId, page = 1, limit = 10) => {
        if (!teacherId) {
            throw new BadRequestError("Teacher ID is required");
        }

        const filter = { teacher: teacherId };

        const totalExams = await examRepo.countExams(filter);

        const exams = await examRepo.listExams(filter, page, limit);
        const totalPages = Math.ceil(totalExams / limit);

        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: [
                        "_id",
                        "title",
                        "description",
                        "startTime",
                        "endTime",
                        "status",
                        "teacher",
                        "question",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: exam,
                }),
            ),
        };
    };

    static filterExams = async (query, page, limit) => {
        console.log("Query:", query);

        const { totalExams, exams } = await examRepo.filterExams(query, page, limit);
        const totalPages = Math.ceil(totalExams / limit);
        return {
            total: totalExams,
            totalPages,
            exams: exams.map((exam) =>
                getInfoData({
                    fields: [
                        "_id",
                        "title",
                        "description",
                        "startTime",
                        "endTime",
                        "status",
                        "teacher",
                        "question",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: exam,
                }),
            ),
        };
    };
}

module.exports = ExamService;
