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
// Bayi Güncelleme (Admin Tokena gerek yok)
router.put('/dealers/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;
  const { dealerName, email, contactName, status, timezone } = req.body;

  try {
    const dealer = await prisma.dealer.update({
      where: { phoneNumber },
      data: { dealerName, email, phoneNumber, contactName, status, timezone }
    });
    res.json(dealer);
  } catch (error) {
    console.error('Error updating dealer:', error);
    res.status(400).json({ error: 'Bayi güncellenemedi. Hata: ' + error.message });
  }
});

// Bayi Silme (Admin Tokena gerek yok)
router.delete('/dealers/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    await prisma.dealer.delete({ where: { phoneNumber } });
    res.json({ message: 'Bayi silindi.' });
  } catch (error) {
    console.error('Error deleting dealer:', error);
    res.status(400).json({ error: 'Bayi silinemedi. Hata: ' + error.message });
  }
});


module.exports = router;
