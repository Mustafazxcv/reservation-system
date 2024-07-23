const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

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

// Bayi Giriş İşlemi
router.post('/login/dealer', async (req, res) => {
  const { email, password } = req.body;

  try {
    const dealer = await prisma.dealer.findUnique({ where: { email } });
    if (!dealer) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch) return res.status(400).json({ error: 'Geçersiz email veya şifre.' });

    const token = jwt.sign({ id: dealer.id, email: dealer.email, role: 'dealer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Giriş işlemi başarısız.' });
  }
});

module.exports = router;
