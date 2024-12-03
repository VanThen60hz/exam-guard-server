"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const redisService = require("./redis.service");
const examRepo = require("../repo/exam.repo");
const gradeRepo = require("../repo/grade.repo");
const questionRepo = require("../repo/question.repo");
const answerRepo = require("../repo/answer.repo");
const schedule = require("node-schedule");

class ExamService {
    static async findExamById(examId, userId) {
        const exam = await examRepo.findExamById(examId);

        if (!exam) {
            throw new BadRequestError("Exam not found");
        }

        if (exam.teacher._id.toString() !== userId) {
            throw new UnauthorizedError("You are not authorized to access this exam");
        }

        const studentCount = await this._calculateStudentCount(examId);

        return {
            ...getInfoData({
                fields: [
                    "_id",
                    "title",
                    "description",
                    "startTime",
                    "endTime",
                    "duration",
                    "status",
                    "teacher",
                    "question",
                    "createdAt",
                    "updatedAt",
                ],
                object: exam,
            }),
            studentCount,
        };
    }

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
                "duration",
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
                "duration",
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

        const studentCountKey = `exam:${examId}:studentCount`;
        await redisService.deleteKey(studentCountKey);

        return { message: "Exam deleted successfully" };
    };

    static async filterExamsForTeacher(filter, page = 1, limit = 10) {
        const { query, teacher: teacherId, status } = filter;

        const additionalFilter = { teacher: teacherId };
        if (status !== undefined) {
            additionalFilter.status = status;
        }

        const { totalExams, exams } = await examRepo.filterExams(query, page, limit, additionalFilter);
        const totalPages = Math.ceil(totalExams / limit);

        const examsWithStudentCount = await Promise.all(
            exams.map(async (exam) => {
                const studentCount = await this._calculateStudentCount(exam._id);
                return {
                    ...getInfoData({
                        fields: [
                            "_id",
                            "title",
                            "description",
                            "startTime",
                            "endTime",
                            "duration",
                            "status",
                            "questionCount",
                            "teacher",
                            "createdAt",
                            "updatedAt",
                        ],
                        object: exam,
                    }),
                    studentCount,
                };
            }),
        );

        return {
            total: totalExams,
            totalPages,
            exams: examsWithStudentCount,
        };
    }

    static async listExamsForTeacher(filter = {}, page, limit) {
        const totalExams = await examRepo.countExams(filter);
        const exams = await examRepo.listExams(filter, page, limit);
        const totalPages = Math.ceil(totalExams / limit);

        // Sử dụng Promise.all để chờ tất cả các Promise trong map hoàn thành
        const examsWithStudentCount = await Promise.all(
            exams.map(async (exam) => {
                const studentCount = await this._calculateStudentCount(exam._id);
                return {
                    ...getInfoData({
                        fields: [
                            "_id",
                            "title",
                            "description",
                            "startTime",
                            "endTime",
                            "duration",
                            "questionCount",
                            "status",
                            "createdAt",
                            "updatedAt",
                        ],
                        object: exam,
                    }),
                    studentCount,
                };
            }),
        );

        return {
            total: totalExams,
            totalPages,
            exams: examsWithStudentCount,
        };
    }

    static listExamsForStudent = async (filter = {}, page, limit, studentId) => {
        const completedExams = await gradeRepo.listGradesByStudent(studentId);

        const completedExamIds = completedExams.map((grade) => grade?.exam?._id).filter((id) => id);

        const updatedFilter = {
            ...filter,
            _id: { $nin: completedExamIds },
        };

        const totalExams = await examRepo.countExams(updatedFilter);
        const exams = await examRepo.listExams(updatedFilter, page, limit);

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
                        "duration",
                        "status",
                        "questionCount",
                        "teacher",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: exam,
                }),
            ),
        };
    };

    static async filterExamsForStudent(filter, page = 1, limit = 10) {
        const { query, status } = filter;

        const { totalExams, exams } = await examRepo.filterExams(query, page, limit, { status });

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
                        "duration",
                        "status",
                        "questionCount",
                        "teacher",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: exam,
                }),
            ),
        };
    }

    static async joinExam(examId, studentId, page = 1, limit = 10) {
        const exam = await this._validateExamAndStudent(examId, studentId);

        const submissionTime = await this._scheduleExamSubmissionIfNeeded(exam, studentId);
        const remainingTimeMs = submissionTime ? submissionTime - Date.now() : 0;

        const minutes = Math.floor(remainingTimeMs / 60000);
        const seconds = Math.floor((remainingTimeMs % 60000) / 1000);

        const totalQuestions = await questionRepo.countQuestions({ exam: examId });
        const totalPages = Math.ceil(totalQuestions / limit);
        const questions = await questionRepo.listQuestions({ exam: examId }, page, limit);

        return {
            message: "Exam joined successfully",
            remainingTime: { minutes, seconds },
            total: totalQuestions,
            totalPages,
            questions: questions.map((question) =>
                getInfoData({
                    fields: ["_id", "questionText", "questionType", "questionScore", "options"],
                    object: question,
                }),
            ),
        };
    }

    static async submitExam(examId, studentId, answers) {
        await this._validateExamAndStudent(examId, studentId);

        answers = this._normalizeAnswers(answers);

        await this._checkIfAlreadySubmitted(examId, studentId);

        const questions = await this._fetchQuestions(examId);
        const existingAnswersMap = await this._getExistingAnswersMap(studentId, questions);

        const { newAnswers, updatedAnswers, score } = this._calculateAnswersAndScore(
            answers,
            questions,
            existingAnswersMap,
            studentId,
        );

        await this._saveAnswers(newAnswers, updatedAnswers);

        const newGrade = await this._createGrade(studentId, examId, score);

        if (newGrade) {
            schedule.cancelJob(`submission_${examId}_${studentId}`);
        }

        const studentCountKey = `exam:${examId}:studentCount`;
        const existStudentCountKey = redisService.exists(studentCountKey);
        if (existStudentCountKey) {
            const updatedCount = await redisService.decrement(studentCountKey);

            if (updatedCount === 0) {
                await redisService.deleteKey(studentCountKey);
            }
        }

        return { message: "Exam submitted successfully", newGrade };
    }

    static async _scheduleExamSubmissionIfNeeded(exam, studentId) {
        const jobName = `submission_${exam._id}_${studentId}`;
        const existingJob = schedule.scheduledJobs[jobName];

        if (existingJob) {
            const submissionTime = existingJob.nextInvocation().toDate();
            return submissionTime;
        }

        const studentCountKey = `exam:${exam._id}:studentCount`;
        await redisService.increment(studentCountKey);

        const submissionTime = new Date(Date.now() + exam.duration * 60 * 1000);

        schedule.scheduleJob(jobName, submissionTime, async () => {
            try {
                await this.submitExam(exam._id, studentId, []);
            } catch (error) {
                console.error("Error during auto-submission:", error);
            } finally {
                const job = schedule.scheduledJobs[jobName];
                if (job) {
                    job.cancel();
                    delete schedule.scheduledJobs[jobName];
                }
            }
        });

        return submissionTime;
    }

    static async _validateExamAndStudent(examId, studentId) {
        const exam = await examRepo.findExamById(examId);
        if (!exam) {
            throw new BadRequestError("Exam not found");
        }
        if (exam.teacher._id.toString() === studentId) {
            throw new UnauthorizedError("Teachers cannot submit exams");
        }
        return exam;
    }

    static _normalizeAnswers(answers) {
        return answers && answers.length > 0 ? answers : [];
    }

    static async _checkIfAlreadySubmitted(examId, studentId) {
        const existingGrade = await gradeRepo.findGradeByStudentAndExam(studentId, examId);
        if (existingGrade) {
            throw new BadRequestError("You have already submitted this exam.");
        }
    }

    static async _fetchQuestions(examId) {
        const questions = await questionRepo.findQuestionsByExam(examId);
        if (!questions || questions.length === 0) {
            throw new BadRequestError("No questions found for this exam");
        }
        return questions;
    }

    static async _getExistingAnswersMap(studentId, questions) {
        const questionIds = questions.map((q) => q._id);
        const existingAnswers = await answerRepo.findAnswersByStudentAndQuestions(studentId, questionIds);
        return existingAnswers.reduce((map, ans) => {
            map[ans.question.toString()] = ans;
            return map;
        }, {});
    }

    static _calculateAnswersAndScore(answers, questions, existingAnswersMap, studentId) {
        const newAnswers = [];
        const updatedAnswers = [];
        const score = questions.reduce((total, questionData) => {
            const submittedAnswer = answers.find((a) => a.question.toString() === questionData._id.toString());
            const existingAnswer = existingAnswersMap[questionData._id.toString()];

            let isCorrect = false;
            let answerText = "";

            if (submittedAnswer) {
                answerText = submittedAnswer.answer;
                isCorrect = questionData.correctAnswer === submittedAnswer.answer;

                const answerData = {
                    answerText,
                    isCorrect,
                    question: questionData._id,
                    student: studentId,
                };

                if (existingAnswer) {
                    existingAnswer.answerText = answerData.answerText;
                    existingAnswer.isCorrect = answerData.isCorrect;
                    updatedAnswers.push(existingAnswer);
                } else {
                    newAnswers.push(answerData);
                }
            } else if (existingAnswer) {
                answerText = existingAnswer.answerText;
                isCorrect = existingAnswer.isCorrect;
            }

            return isCorrect ? total + questionData.questionScore : total;
        }, 0);

        return { newAnswers, updatedAnswers, score };
    }

    static async _saveAnswers(newAnswers, updatedAnswers) {
        if (newAnswers.length > 0) {
            await answerRepo.insertManyAnswers(newAnswers);
        }

        if (updatedAnswers.length > 0) {
            await Promise.all(updatedAnswers.map((answer) => answerRepo.updateAnswer(answer)));
        }
    }

    static async _createGrade(studentId, examId, score) {
        return await gradeRepo.createGrade({
            student: studentId,
            exam: examId,
            score,
            feedback: "Exam graded successfully",
        });
    }

    static async _calculateStudentCount(examId) {
        const key = `exam:${examId}:studentCount`;
        const count = await redisService.getValue(key);
        return count ? parseInt(count, 10) : 0;
    }
}

module.exports = ExamService;
