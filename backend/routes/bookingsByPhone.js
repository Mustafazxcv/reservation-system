const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment-timezone');
const router = express.Router();

// Telefon numarasına göre tüm rezervasyonları getirme (GET)
router.get('/bookings/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;
  const userTimezone = req.query.timezone || 'UTC';

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        phoneNumber: phoneNumber
      }
    });

    const formattedBookings = bookings.map((booking) => {
      const localDateTime = moment.tz(booking.date, 'UTC').tz(userTimezone).format('YYYY-MM-DD HH:mm');
      return {
        ...booking,
        localDate: localDateTime.split(' ')[0],
        localTime: localDateTime.split(' ')[1]
      };
    });

    res.json(formattedBookings);
  } catch (error) {
    console.error('Rezervasyonlar alınamadı:', error);
    res.status(500).json({ error: 'Rezervasyonlar alınamadı.' });
  }
});

module.exports = router;
