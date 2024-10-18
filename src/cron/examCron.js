const cron = require("node-cron");
const examModel = require("../models/exam.model");

const startExamCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        const currentTime = new Date();

        try {
            const scheduledUpdate = await examModel.updateMany(
                { startTime: { $gt: currentTime } },
                { $set: { status: "Scheduled" } },
            );

            const inProgressUpdate = await examModel.updateMany(
                { startTime: { $lt: currentTime }, endTime: { $gt: currentTime } },
                { $set: { status: "In Progress" } },
            );

            const completedUpdate = await examModel.updateMany(
                { endTime: { $lt: currentTime } },
                { $set: { status: "Completed" } },
            );
        } catch (error) {
            console.error("Error updating exam statuses:", error);
        }
    });
};

module.exports = startExamCron;
