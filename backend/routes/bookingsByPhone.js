const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Telefon numarasına göre tüm rezervasyonları getirme (GET)
router.get('/bookings/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        phoneNumber: phoneNumber
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Rezervasyonlar alınamadı:', error);
    res.status(500).json({ error: 'Rezervasyonlar alınamadı.' });
  }
});

module.exports = router;
