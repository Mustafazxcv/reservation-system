const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { dealerName, email, password, phoneNumber, contactName, timezone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const dealer = await prisma.dealer.create({
      data: {
        dealerName,
        email,
        password: hashedPassword,
        phoneNumber,
        contactName,
        status: true,
        emailVerification: false,
        timezone
      }
    });
    res.status(201).json(dealer);
  } catch (error) {
    res.status(400).json({ error: 'Bayi kaydı başarısız.' });
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
