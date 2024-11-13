// src/config/rabbitmq.js
const amqp = require("amqplib");

async function createRabbitMqConnection() {
    return amqp.connect("amqps://qpjwovtb:gRLAwlqVnUhwKwD12Y6QLDQSplgDrf-i@octopus.rmq3.cloudamqp.com/qpjwovtb");
}

module.exports = { createRabbitMqConnection };
