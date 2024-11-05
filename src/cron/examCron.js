const cron = require("node-cron");
const moment = require("moment-timezone");
const examModel = require("../models/exam.model");

const startExamCron = () => {
    // Schedule the cron job to run every 10 seconds
    cron.schedule("*/10 * * * * *", async () => {
        // Get current time in Vietnamese timezone (UTC+7)
        const currentTime = moment().tz("Asia/Ho_Chi_Minh");

        console.log("Running exam status update cron job at", currentTime.format("YYYY-MM-DD HH:mm:ss"));

        try {
            const scheduledExams = await examModel.find({
                startTime: { $gt: currentTime.toDate() },
                status: { $ne: "Scheduled" },
            });
            if (scheduledExams.length > 0) {
                await examModel.updateMany(
                    { _id: { $in: scheduledExams.map((exam) => exam._id) } },
                    { $set: { status: "Scheduled" } },
                );
                console.log(
                    "Scheduled exams:",
                    scheduledExams.map((exam) => exam._id),
                );
            }

            const inProgressExams = await examModel.find({
                startTime: { $lt: currentTime.toDate() },
                endTime: { $gt: currentTime.toDate() },
                status: { $ne: "In Progress" },
            });
            if (inProgressExams.length > 0) {
                await examModel.updateMany(
                    { _id: { $in: inProgressExams.map((exam) => exam._id) } },
                    { $set: { status: "In Progress" } },
                );
                console.log(
                    "In Progress exams:",
                    inProgressExams.map((exam) => exam._id),
                );
            }

            const completedExams = await examModel.find({
                endTime: { $lt: currentTime.toDate() },
                status: { $ne: "Completed" },
            });
            if (completedExams.length > 0) {
                await examModel.updateMany(
                    { _id: { $in: completedExams.map((exam) => exam._id) } },
                    { $set: { status: "Completed" } },
                );
                console.log(
                    "Completed exams:",
                    completedExams.map((exam) => exam._id),
                );
            }
        } catch (error) {
            console.error("Error updating exam statuses:", error);
        }
    });
};

module.exports = startExamCron;
