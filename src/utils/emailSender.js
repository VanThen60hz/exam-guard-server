const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Đưa email người gửi vào biến môi trường
            pass: process.env.EMAIL_PASSWORD, // Mật khẩu cũng được lưu trong biến môi trường
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Đặt email người gửi từ biến môi trường
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
