const gradeRepo = require("../repo/grade.repo");
const { ForbiddenError } = require("../core/error.response");

const checkExamSubmission = async (req, res, next) => {
    const { id: examId } = req.params;
    const studentId = req.userId;

    try {
        const existingGrade = await gradeRepo.findGradeByStudentAndExam(studentId, examId);

        if (existingGrade) {
            throw new ForbiddenError("You have already completed this exam.");
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkExamSubmission;
