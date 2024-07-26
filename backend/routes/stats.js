const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Toplam bayi sayısını getirme
router.get('/total-dealers', async (req, res) => {
  try {
    const totalDealers = await prisma.dealer.count();
    res.json({ totalDealers });
  } catch (error) {
    console.error('Toplam bayi sayısı alınamadı:', error);
    res.status(500).json({ error: 'Toplam bayi sayısı alınamadı.' });
  }
});

// Toplam rezervasyon sayısını getirme
router.get('/total-bookings', async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    res.json({ totalBookings });
  } catch (error) {
    console.error('Toplam rezervasyon sayısı alınamadı:', error);
    res.status(500).json({ error: 'Toplam rezervasyon sayısı alınamadı.' });
  }
});

module.exports = router;
