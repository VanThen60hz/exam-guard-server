const { createRabbitMqConnection } = require("../configs/rabbitmq");

async function createTeacherQueueConsumer(teacherId, io) {
    try {
        const connection = await createRabbitMqConnection();
        const channel = await connection.createChannel();
        const queue = `cheating_notifications_teacher_${teacherId}`;

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, (message) => {
            if (message !== null) {
                const notificationData = JSON.parse(message.content.toString());

                io.to(teacherId).emit("newCheatingDetected", notificationData);
                channel.ack(message);
            }
        });

        console.log(`RabbitMQ consumer for teacher ${teacherId} is set up and listening for messages.`);
    } catch (error) {
        console.error(`Failed to set up RabbitMQ consumer for teacher ${teacherId}:`, error);
    }
}

module.exports = { createTeacherQueueConsumer };
