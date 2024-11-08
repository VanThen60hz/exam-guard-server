// cheatingResolve.js

const amqp = require("amqplib");

const cheatingResolve = async (cheatingStatistic) => {
    const connection = await amqp.connect(
        "amqps://qpjwovtb:gRLAwlqVnUhwKwD12Y6QLDQSplgDrf-i@octopus.rmq3.cloudamqp.com/qpjwovtb",
    );
    const channel = await connection.createChannel();
    const queue = "cheating_notifications";

    await channel.assertQueue(queue, { durable: false });
    const message = JSON.stringify({
        message: "Cheating statistic updated",
        data: cheatingStatistic,
    });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log("Sent cheating statistic notification to RabbitMQ");

    setTimeout(() => {
        connection.close();
    }, 500);
};

module.exports = {
    cheatingResolve,
};
