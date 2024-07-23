const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const router = express.Router();

router.get('/stats', [authenticateToken, authorizeRole('admin')], async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalGuests = await prisma.guest.count();
    const totalDealers = await prisma.dealer.count();
    const activeDealers = await prisma.dealer.count({ where: { status: true } });
    const passiveDealers = await prisma.dealer.count({ where: { status: false } });

    res.json({
      totalBookings,
      totalGuests,
      totalDealers,
      activeDealers,
      passiveDealers
    });
  } catch (error) {
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});
router.get('/stats', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const upcomingBookings = await prisma.booking.count({ where: { status: 'Upcoming' } });
    const pastBookings = await prisma.booking.count({ where: { status: 'Past' } });
    const canceledBookings = await prisma.booking.count({ where: { status: 'Canceled' } });
    const totalGuests = await prisma.guest.count();
    const totalDealers = await prisma.dealer.count();
    const activeDealers = await prisma.dealer.count({ where: { status: true } });
    const passiveDealers = await prisma.dealer.count({ where: { status: false } });

    res.json({
      totalBookings,
      upcomingBookings,
      pastBookings,
      canceledBookings,
      totalGuests,
      totalDealers,
      activeDealers,
      passiveDealers
    });
  } catch (error) {
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});

// Bayi Listeleme
router.get('/dealers', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Bayi listesi alınamadı.' });
  }
});

// Bayi Güncelleme
router.put('/dealers/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { dealerName, email, phoneNumber, contactName, status, timezone } = req.body;

  try {
    const dealer = await prisma.dealer.update({
      where: { id },
      data: { dealerName, email, phoneNumber, contactName, status, timezone }
    });
    res.json(dealer);
  } catch (error) {
    res.status(400).json({ error: 'Bayi güncellenemedi.' });
  }
});

// Bayi Silme
router.delete('/dealers/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.dealer.delete({ where: { id } });
    res.json({ message: 'Bayi silindi.' });
  } catch (error) {
    res.status(400).json({ error: 'Bayi silinemedi.' });
  }
});

module.exports = router;
