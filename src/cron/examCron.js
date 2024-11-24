const cron = require("node-cron");
const examModel = require("../models/exam.model");
const axios = require("axios");

const startExamCron = () => {
    cron.schedule("*/10 * * * * *", async () => {
        const currentTimeUTC = new Date();
        const currentTimeVN = new Date(currentTimeUTC.getTime() + 7 * 60 * 60 * 1000);

        console.log("Running exam status update cron job at", currentTimeVN.toISOString());

        try {
            const scheduledExams = await examModel.find({
                startTime: { $gt: currentTimeVN },
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
                startTime: { $lt: currentTimeVN },
                endTime: { $gt: currentTimeVN },
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
                endTime: { $lt: currentTimeVN },
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

            await axios.get("https://exam-guard-server.onrender.com");
        } catch (error) {
            console.error("Error updating exam statuses:", error);
        }
    });
};

module.exports = startExamCron;
