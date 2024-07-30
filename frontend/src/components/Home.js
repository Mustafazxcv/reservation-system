import React, { useState, useEffect } from 'react';
import Image1 from '../assets/images/1.webp';
import Image2 from '../assets/images/2.webp';
import Image3 from '../assets/images/3.webp';
import Image5 from '../assets/images/6.png';
import Image6 from '../assets/images/logo.png';

const Home = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalDealers, setTotalDealers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsResponse = await fetch('http://localhost:3000/api/stats/total-bookings');
        const bookingsData = await bookingsResponse.json();
        setTotalBookings(bookingsData.totalBookings);

        const dealersResponse = await fetch('http://localhost:3000/api/stats/total-dealers');
        const dealersData = await dealersResponse.json();
        setTotalDealers(dealersData.totalDealers);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <main className="container mx-auto p-6 flex-grow">
        <section className="bg-white-200 flex flex-col md:flex-row items-center py-20 px-6 rounded-lg">
          <div className="md:w-1/2 p-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hoş Geldiniz</h2>
            <p className="text-lg text-gray-600 mb-8">
              Personel takvimleri, SMS hatırlatıcıları, müşteri veri tabanı ve pazarlama araçları ile çevrimiçi rezervasyon yazılımı.
            </p>
            <a href="/register/dealer" className="bg-blue-600 text-white py-4 px-24 rounded-full hover:bg-gray-700">
              Hemen Başlayın
            </a>
          </div>
          <div className="md:w-1/2">
            <img src={Image5} alt="Hoş Geldiniz" className="rounded-lg" />
          </div>
        </section>

        <section className="py-20 bg-white-300">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Rezervasyon Sayısı</h3>
              <p className="text-4xl text-blue-600">{totalBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Bayi Sayısı</h3>
              <p className="text-4xl text-blue-600">{totalDealers}</p>
            </div>
          </div>
        </section>

        <section className="py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Şirketinizi, personelinizi ve müşteri tabanınızı tek bir sistemde yönetin.
            </h3>
            <p className="text-gray-600 mb-4">
              Personel programını, fiyatları, sunulan hizmetleri ve kullanılabilirliği kolayca kontrol edin. Ekibinizi iş gündemi
              hakkında otomatik olarak bilgilendirin. Müşterilerle iletişim kurabilmeniz, referanslar isteyebilmeniz ve hizmetlerinizi
              yeniden rezerve etmeye teşvik edebilmeniz için müşteri veritabanı oluşturun.
            </p>
            <a href="/register/dealer" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-gray-700">
              Hemen Başlayın
            </a>
          </div>
          <div className="md:w-1/2">
            <img src={Image3} alt="Kolay Yönetim" className="rounded-lg shadow-lg" />
          </div>
        </section>

        <section className="py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <img src={Image2} alt="Kolay Yönetim" className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 p-6 order-1 md:order-2">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Otomatik SMS hatırlatıcıları, onayları ve güncellemeleri.</h3>
            <p className="text-gray-600 mb-4">
              Müşterilerinize otomatik SMS ve e-posta hatırlatıcıları göndererek kaçırılan rezervasyon sayısını en aza indirin.
              Rezervasyon detaylarını teyit eden SMS göndererek müşterilere rezervasyonların başarıyla kabul edildiğini otomatik olarak
              temin edin.
            </p>
            <a href="/register/dealer" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-gray-700">
              Hemen Başlayın
            </a>
          </div>
        </section>

        <section className="py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              İşletmeniz için özel olarak hazırlanmış veri formları ile müşteri bilgilerini toplayın.
            </h3>
            <p className="text-gray-600 mb-4">
              Gelişmiş formları kullanın ve müşteriler ve rezervasyonlar hakkında her türlü veriyi toplayın. Belgeler, fotoğraflar,
              videolar, veri formları ve daha fazlasını yükleyebilirsiniz.
            </p>
            <a href="/register/dealer" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-gray-700">
              Hemen Başlayın
            </a>
          </div>
          <div className="md:w-1/2">
            <img src={Image1} alt="Kolay Yönetim" className="rounded-lg shadow-lg" />
          </div>    
        </section>
        <hr className="h-1 w-full bg-gray-300 border-none" />
        <footer className="bg-gray text-gray-800 py-10 w-full">
  <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="col-span-1 flex items-center justify-center md:justify-start">
      <img src={Image6} alt="Logo" className="h-20 w-20 object-contain" />
    </div>
    <div className="col-span-1">
      <h4 className="font-semibold text-lg mb-4">Şirket</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline hover:text-blue-500">Şartlar ve Koşullar</a></li>
        <li><a href="#" className="hover:underline hover:text-blue-500">Gizlilik Politikası</a></li>
        <li><a href="#" className="hover:underline hover:text-blue-500">Partner Olmak</a></li>
        <li><a href="#" className="hover:underline hover:text-blue-500">Kullanım Kılavuzları</a></li>
        <li><a href="#" className="hover:underline hover:text-blue-500">Belgeleme</a></li>
      </ul>
    </div>
    <div className="col-span-1">
      <h4 className="font-semibold text-lg mb-4">Bizimle İletişime Geçin</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline hover:text-blue-500">İletişim</a></li>
      </ul>
    </div>
  </div>
  <div className="text-center mt-8">
    <p className="text-gray-600">&copy; 2024 Rezervem. Tüm hakları saklıdır.</p>
  </div>
</footer>

      </main>
    </div>
  );
};

export default Home;
