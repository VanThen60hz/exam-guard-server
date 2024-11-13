const { createTeacherQueueConsumer } = require("../consumers/teacherQueueConsumer");

function handleSocketEvents(io) {
    io.on("connection", (socket) => {
        const teacherId = socket.handshake.query.teacherId;

        if (teacherId) {
            socket.join(teacherId);
            console.log(`Teacher with ID ${teacherId} connected and joined room ${teacherId}`);

            createTeacherQueueConsumer(teacherId, io);
        }

        socket.on("disconnect", () => {
            console.log(`Teacher with ID ${teacherId} disconnected`);
        });
    });
}

module.exports = { handleSocketEvents };
