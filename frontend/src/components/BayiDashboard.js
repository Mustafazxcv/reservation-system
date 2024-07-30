import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateBookingForm from '../components/CreateBookingForm';
import CancelBookingForm from '../components/CancelBookingForm';
import BookingList from '../components/BookingList';

const BayiDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [canceledBookings, setCanceledBookings] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('dealer_token');

  const fetchBookings = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/dealer/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (endpoint === 'upcoming') setUpcomingBookings(result);
        if (endpoint === 'past') setPastBookings(result);
        if (endpoint === 'canceled') setCanceledBookings(result);
        if (endpoint === 'bookings') setAllBookings(result);
      } else {
        console.error(`Failed to fetch ${endpoint} bookings`);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint} bookings:`, error);
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }

    fetchBookings('upcoming');
    fetchBookings('past');
    fetchBookings('canceled');
    fetchBookings('bookings');
  }, [token]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.removeItem('dealer_token');
    toast.success('Başarıyla çıkış yapıldı!');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold"></h3>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </div>
        <div className="flex space-x-4">
          <CreateBookingForm token={token} fetchBookings={fetchBookings} />
          <CancelBookingForm token={token} fetchBookings={fetchBookings} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <BookingList bookings={upcomingBookings} title="Yaklaşan Rezervasyonlar" toggleSection={toggleSection} openSection={openSection} />
          <BookingList bookings={pastBookings} title="Geçmiş Rezervasyonlar" toggleSection={toggleSection} openSection={openSection} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BookingList bookings={canceledBookings} title="İptal Edilen Rezervasyonlar" toggleSection={toggleSection} openSection={openSection} />
          <BookingList bookings={allBookings} title="Tüm Rezervasyonlar" toggleSection={toggleSection} openSection={openSection} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default BayiDashboard;
