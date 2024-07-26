const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const router = express.Router();

router.get('/dealer/bookings', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId: dealerId
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Rezervasyonlar alınamadı:', error);
    res.status(500).json({ error: 'Rezervasyonlar alınamadı.', details: error.message });
  }
});

router.post('/guest/details', async (req, res) => {
  const { fullname, email, phoneNumber } = req.body;

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        fullname,
        email,
        phoneNumber
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Rezervasyon bulunamadı.' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Rezervasyon detayları alınamadı:', error);
    res.status(500).json({ error: 'Rezervasyon detayları alınamadı.' });
  }
});

router.post('/', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const { fullname, email, phoneNumber, bookingNote, timezone, date, time } = req.body;
  const dealerId = req.user.id;

  try {
    // Telefon numarasının benzersizliğini kontrol et
    const existingBooking = await prisma.booking.findFirst({
      where: { phoneNumber: phoneNumber }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Bu telefon numarasıyla zaten bir rezervasyon mevcut.' });
    }

    const isoDate = new Date(date);
    if (isNaN(isoDate.getTime())) {
      throw new Error('Geçersiz tarih formatı.');
    }

    const booking = await prisma.booking.create({
      data: {
        fullname,
        email,
        phoneNumber,
        bookingNote,
        timezone,
        dealer: { connect: { id: dealerId } },
        date: isoDate,
        time,
        status: 'Upcoming'
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Rezervasyon oluşturulamadı:', error);
    res.status(400).json({ error: 'Rezervasyon oluşturulamadı.', details: error.message });
  }
});

router.get('/dealer/upcoming', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId,
        status: 'Upcoming',
        date: {
          gte: new Date()
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Yaklaşan rezervasyonlar alınamadı.' });
  }
});

router.get('/dealer/past', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId,
        status: 'Past',
        date: {
          lt: new Date()
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Geçmiş rezervasyonlar alınamadı.' });
  }
});

router.get('/dealer/canceled', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId,
        status: 'Canceled'
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'İptal edilmiş rezervasyonlar alınamadı.' });
  }
});

router.get('/dealer/upcoming-week', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;
  const now = new Date();
  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + 7);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId,
        status: 'Upcoming',
        date: {
          gte: now,
          lte: oneWeekLater
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Yaklaşan 1 hafta içindeki rezervasyonlar alınamadı.' });
  }
});
router.put('/cancel/:id', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const { id } = req.params;
  const dealerId = req.user.id;

  try {
    const booking = await prisma.booking.updateMany({
      where: {
        id,
        dealerId,
        status: 'Upcoming'
      },
      data: {
        status: 'Canceled'
      }
    });

    if (booking.count === 0) {
      return res.status(404).json({ error: 'Rezervasyon bulunamadı veya zaten iptal edilmiş.' });
    }

    res.json({ message: 'Rezervasyon iptal edildi.' });
  } catch (error) {
    res.status(400).json({ error: 'Rezervasyon iptal edilemedi.' });
  }
});
router.get('/dealer/canceled', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const dealerId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        dealerId,
        status: 'Canceled'
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'İptal edilmiş rezervasyonlar alınamadı.' });
  }
});
module.exports = router;
