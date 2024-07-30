const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const prisma = new PrismaClient();
const router = express.Router();

router.put('/cancel', authenticateToken, authorizeRole('dealer'), async (req, res) => {
  const { phoneNumber } = req.body;
  const dealerId = req.user.id;

  try {
    const booking = await prisma.booking.updateMany({
      where: {
        phoneNumber: phoneNumber,
        dealerId: dealerId,
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

module.exports = router;
    