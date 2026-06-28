const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.User_email,
      pass: process.env.User_password,
    },
  });

  const mailOptions = {
    from: "test@example.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
