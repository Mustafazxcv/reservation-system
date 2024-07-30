const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Bayi Güncelleme (Admin Tokena gerek yok)
router.put('/dealers/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;
  const { dealerName, email, contactName, status, timezone } = req.body;

  try {
    const dealer = await prisma.dealer.findFirst({
      where: { phoneNumber }
    });

    if (!dealer) {
      return res.status(404).json({ error: 'Bayi bulunamadı.' });
    }

    const updatedDealer = await prisma.dealer.update({
      where: { id: dealer.id },
      data: { dealerName, email, phoneNumber, contactName, status, timezone }
    });

    res.json(updatedDealer);
  } catch (error) {
    console.error('Error updating dealer:', error);
    res.status(400).json({ error: 'Bayi güncellenemedi. Hata: ' + error.message });
  }
});

// Bayi Silme (Admin Tokena gerek yok)
router.delete('/dealers/phone/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const dealer = await prisma.dealer.findFirst({
      where: { phoneNumber }
    });

    if (!dealer) {
      return res.status(404).json({ error: 'Bayi bulunamadı.' });
    }

    // İlişkili rezervasyonları sil
    await prisma.booking.deleteMany({
      where: { dealerId: dealer.id }
    });

    // Bayiyi sil
    await prisma.dealer.delete({
      where: { id: dealer.id }
    });

    res.json({ message: 'Bayi ve ilişkili rezervasyonlar silindi.' });
  } catch (error) {
    console.error('Error deleting dealer and bookings:', error);
    res.status(400).json({ error: 'Bayi ve ilişkili rezervasyonlar silinemedi. Hata: ' + error.message });
  }
});

module.exports = router;
