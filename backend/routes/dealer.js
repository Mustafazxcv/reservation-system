const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const router = express.Router();

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
        status: 'pending',
        emailVerification: false,
        verificationToken: token,
        timezone
      }
    });

    const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
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
    });

    res.status(201).json({ message: 'Dealer registered, verification email sent' });
  } catch (error) {
    console.error('Error during dealer registration:', error);
    res.status(400).json({ error: 'Bayi kaydı başarısız.', details: error.message });
  }
});


router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Bayi listesi alınamadı.' });
  }
});

module.exports = router;
