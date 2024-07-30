const nodemailer = require('nodemailer');
require('dotenv').config(); // .env dosyasını yükleme

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// E-posta gönderme fonksiyonu
const sendVerificationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = { sendVerificationEmail };
