const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
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

// Admin Kayıt İşlemi
router.post('/register/admin', async (req, res) => {
  const { email, password, phoneNumber, fullname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        phoneNumber,
        fullname,
        status: true,
        emailVerification: false
      }
    });
    res.status(201).json(admin);
  } catch (error) {
    console.error('Admin kaydı hatası:', error);
    res.status(400).json({ error: 'Admin kaydı başarısız.', details: error.message });
  }
});

// Admin Giriş İşlemi
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Giriş işlemi başarısız.' });
  }
});

// Bayi Kayıt İşlemi
router.post('/register/dealer', async (req, res) => {
  const { dealerName, email, password, phoneNumber, contactName, timezone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  try {
    const dealer = await prisma.dealer.create({
      data: {
        dealerName,
        email,
        password: hashedPassword,
        phoneNumber,
        contactName,
        status: false, // Boolean değer sağlıyoruz
        emailVerification: false, // Boolean değer sağlıyoruz
        verificationToken: token,
        timezone
      }
    });

    const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent: ' + info.response);
      res.status(201).json({ message: 'Dealer registered, verification email sent' });
    });
  } catch (error) {
    console.error('Error during dealer registration:', error);
    res.status(400).json({ error: 'Bayi kaydı başarısız.', details: error.message });
  }
});

// Bayi Giriş İşlemi
router.post('/login/dealer', async (req, res) => {
  const { email, password } = req.body;

  try {
    const dealer = await prisma.dealer.findUnique({ where: { email } });
    if (!dealer) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    if (dealer.status === 'pending') {
      return res.status(400).json({ error: 'Email is not verified. Please check your email.' });
    }

    const token = jwt.sign({ id: dealer.id, email: dealer.email, role: 'dealer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Giriş işlemi başarısız.' });
  }
});

// Kullanıcı Doğrulama
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const dealer = await prisma.dealer.update({
      where: { email },
      data: { status: true, verificationToken: null, emailVerification: true }
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ error: 'Invalid or expired token', details: error.message });
  }
});

module.exports = router;
