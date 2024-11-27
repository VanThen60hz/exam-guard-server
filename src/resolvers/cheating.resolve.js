const { getRabbitMQChannel } = require("../configs/rabbitmq.config");

const cheatingResolve = async (cheatingStatistic, teacherId) => {
    try {
        const channel = await getRabbitMQChannel();
        const queue = `cheating_notifications_teacher_${teacherId}`;

        await channel.assertQueue(queue, { durable: false });

        const message = JSON.stringify({
            message: "Cheating statistic updated",
            data: cheatingStatistic,
            teacherId: teacherId,
        });

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Sent cheating statistic notification to RabbitMQ for teacher ${teacherId}`);
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
    }
};

module.exports = {
    cheatingResolve,
};
