"use strict";

const { Types } = require("mongoose");
const gradeModel = require("../models/grade.model");
const questionModel = require("../models/question.model");
const answerModel = require("../models/answer.model");

class GradeRepo {
    constructor() {
        this.selectFields = {
            score: 1,
            exam: 1,
            student: 1,
        };
    }

    static async createGrade(gradeData) {
        return await gradeModel.create(gradeData);
    }

    static async findGradeById(gradeId, select = this.selectFields) {
        return await gradeModel
            .findOne({
                _id: gradeId,
            })
            .select(select)
            .populate("exam")
            .populate("student")
            .lean();
    }

    static async updateGrade(gradeId, gradeData) {
        return await gradeModel.findByIdAndUpdate(gradeId, gradeData, { new: true });
    }

    static async deleteGrade(gradeId) {
        return await gradeModel.findByIdAndDelete(gradeId);
    }

    static async countGrades(filter = {}) {
        return await gradeModel.countDocuments(filter);
    }

    static async listGrades(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await gradeModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("exam", "_id teacher title description")
            .populate("student", "_id username email name avatar")
            .lean();
    }

    static async listGradesByStudent(studentId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await gradeModel
            .find({ student: studentId })
            .skip(skip)
            .limit(limit)
            .populate("exam", "_id teacher title description")
            .lean();
    }

    static async searchGradesByExam(filter = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await gradeModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate("exam", "_id teacher title description")
            .populate("student", "_id username email name avatar")
            .lean();
    }

    static async searchGradesByExamWithReferences(examId, query = "", page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const pipeline = [
            { $match: { exam: new Types.ObjectId(`${examId}`) } },

            {
                $match: {},
            },
        ];

        const [grades, totalGrades] = await Promise.all([
            gradeModel.aggregate(pipeline).exec(),
            gradeModel.countDocuments({ exam: examId }).exec(),
        ]);

        return { grades, totalGrades };
    }

    static async calculateGradeForStudent(examId, studentId) {
        try {
            const questions = await questionModel.find({ exam: examId });

            if (!questions || questions.length === 0) {
                throw new Error("Không tìm thấy câu hỏi cho kỳ thi này.");
            }

            const answers = await answerModel.find({
                student: studentId,
                question: { $in: questions.map((q) => q._id) },
            });

            let totalScore = 0;

            for (const question of questions) {
                const studentAnswer = answers.find((answer) => answer.question.toString() === question._id.toString());

                if (studentAnswer && studentAnswer.isCorrect) {
                    totalScore += question.questionScore;
                }
            }

            const grade = await gradeModel.create({
                score: totalScore,
                exam: examId,
                student: studentId,
            });

            return grade;
        } catch (error) {
            console.error("Lỗi khi tính toán điểm: ", error);
            throw error;
        }
    }

    static async findGradeByStudentAndExam(studentId, examId) {
        return await gradeModel.findOne({ student: studentId, exam: examId }).lean();
    }

    static deleteByStudent = async (studentId, session) => {
        return gradeModel.deleteMany({ student: studentId }).session(session);
    };
}

module.exports = GradeRepo;
