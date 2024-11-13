const amqp = require("amqplib");

const cheatingResolve = async (cheatingStatistic, teacherId) => {
    const connection = await amqp.connect(
        "amqps://qpjwovtb:gRLAwlqVnUhwKwD12Y6QLDQSplgDrf-i@octopus.rmq3.cloudamqp.com/qpjwovtb",
    );

    const channel = await connection.createChannel();
    const queue = `cheating_notifications_teacher_${teacherId}`;

    await channel.assertQueue(queue, { durable: false });
    const message = JSON.stringify({
        message: "Cheating statistic updated",
        data: cheatingStatistic,
        teacherId: teacherId,
    });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent cheating statistic notification to RabbitMQ for teacher ${teacherId}`);

    setTimeout(() => {
        connection.close();
    }, 500);
};

module.exports = {
    cheatingResolve,
};
