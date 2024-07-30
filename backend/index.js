const express = require('express');
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv');
const cron = require('node-cron');
const cors = require('cors'); // cors paketini dahil edin

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // CORS'u tüm istekler için etkinleştirin

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantısı başarısız', err));

cron.schedule('*/1 * * * *', async () => {
  console.log('Rezervasyon durumlarını güncelliyor...');
  try {
    const now = new Date();

    // Geçmiş rezervasyonları güncelle
    await prisma.booking.updateMany({
      where: {
        date: {
          lt: now
        },
        status: 'Upcoming'
      },
      data: {
        status: 'Past'
      }
    });

  } catch (error) {
    console.error('Rezervasyon durumları güncellenemedi:', error);
  }
});

cron.schedule('*/1 * * * *', async () => { // Bu cron job her dakika çalışır
  console.log('Rezervasyon durumlarını güncelliyor...');
  try {
    const now = new Date();

    // Geçmiş rezervasyonları güncelle
    await prisma.booking.updateMany({
      where: {
        date: {
          lt: now
        },
        status: 'Upcoming'
      },
      data: {
        status: 'Past'
      }
    });
  } catch (error) {
    console.error('Rezervasyon durumları güncellenemedi:', error);
  }
});

// rotalar
const authRoutes = require('./routes/auth');
const dealerRoutes = require('./routes/dealer');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');
const bookingsByPhoneRoutes = require('./routes/bookingsByPhone');
const statsRoutes = require('./routes/stats');
const dealerOperationsRouter = require('./routes/dealer_operations');
const cancelBookingRoutes = require('./routes/cancelBooking'); // Yeni iptal rotası

app.use('/api/auth', authRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', bookingsByPhoneRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', dealerOperationsRouter);
app.use('/api/cancel', cancelBookingRoutes); // Yeni iptal rotası

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
