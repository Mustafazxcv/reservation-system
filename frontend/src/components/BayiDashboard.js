import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BayiDashboard = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bookingNote: '',
    timezone: '',
    date: '',
    time: ''
  });

  const [cancelBookingId, setCancelBookingId] = useState('');
  const [allBookings, setAllBookings] = useState([]);

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [canceledBookings, setCanceledBookings] = useState([]);
  const [openSection, setOpenSection] = useState(null); // Açılır pencereler için state

  const navigate = useNavigate();
  const token = localStorage.getItem('dealer_token');

  const fetchBookings = async (endpoint, setState) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/dealer/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setState(result);
      } else {
        console.error(`Failed to fetch ${endpoint} bookings`);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint} bookings:`, error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings/dealer/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAllBookings(result);
      } else {
        console.error('Failed to fetch all bookings');
      }
    } catch (error) {
      console.error('Error fetching all bookings:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }

    fetchBookings('upcoming', setUpcomingBookings);
    fetchBookings('past', setPastBookings);
    fetchBookings('canceled', setCanceledBookings);
    fetchAllBookings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCancelBookingChange = (e) => {
    setCancelBookingId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking created:', result);
        setFormData({
          fullname: '',
          email: '',
          phoneNumber: '',
          bookingNote: '',
          timezone: '',
          date: '',
          time: ''
        });
        fetchBookings('upcoming', setUpcomingBookings); // Yeni rezervasyonu yüklemek için
      } else {
        console.error('Booking creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/cancel/${cancelBookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking canceled:', result);
        setUpcomingBookings(upcomingBookings.filter(booking => booking.id !== cancelBookingId));
        fetchBookings('canceled', setCanceledBookings); // İptal edilen rezervasyonu yüklemek için
        setCancelBookingId(''); // Formu temizleyin
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.removeItem('dealer_token');
    navigate('/');
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2x2 font-bold"></h3>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Create a New Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name:</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bookingNote" className="block text-sm font-medium text-gray-700">Booking Note:</label>
                <input
                  type="text"
                  id="bookingNote"
                  name="bookingNote"
                  value={formData.bookingNote}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone:</label>
                <input
                  type="text"
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time:</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Booking
              </button>
            </form>
          </div>
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Cancel Booking</h2>
            <form onSubmit={handleCancelBooking} className="space-y-4">
              <div>
                <label htmlFor="cancelBookingId" className="block text-sm font-medium text-gray-700">Booking ID:</label>
                <input
                  type="text"
                  id="cancelBookingId"
                  name="cancelBookingId"
                  value={cancelBookingId}
                  onChange={handleCancelBookingChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Cancel Booking
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-md shadow-md mb-4">
            <button
              className="w-full text-left px-4 py-2 text-xl font-bold focus:outline-none"
              onClick={() => toggleSection('upcoming')}
            >
              Upcoming Bookings
            </button>
            {openSection === 'upcoming' && (
              <div className="px-4 py-2">
                <ul className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <li key={booking.id} className="p-4 bg-white shadow rounded-md">
                      <strong>ID:</strong> {booking.id}<br />
                      <strong>{booking.fullname}</strong> - {booking.date} {booking.time}<br />
                      Email: {booking.email}<br />
                      Phone: {booking.phoneNumber}<br />
                      Note: {booking.bookingNote}<br />
                      <button
                        onClick={() => handleCancelBooking({ target: { value: booking.id } })}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-100 rounded-md shadow-md mb-4">
            <button
              className="w-full text-left px-4 py-2 text-xl font-bold focus:outline-none"
              onClick={() => toggleSection('past')}
            >
              Past Bookings
            </button>
            {openSection === 'past' && (
              <div className="px-4 py-2">
                <ul className="space-y-4">
                  {pastBookings.map((booking) => (
                    <li key={booking.id} className="p-4 bg-white shadow rounded-md">
                      <strong>ID:</strong> {booking.id}<br />
                      <strong>{booking.fullname}</strong> - {booking.date} {booking.time}<br />
                      Email: {booking.email}<br />
                      Phone: {booking.phoneNumber}<br />
                      Note: {booking.bookingNote}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-md shadow-md mb-4">
            <button
              className="w-full text-left px-4 py-2 text-xl font-bold focus:outline-none"
              onClick={() => toggleSection('canceled')}
            >
              Canceled Bookings
            </button>
            {openSection === 'canceled' && (
              <div className="px-4 py-2">
                <ul className="space-y-4">
                  {canceledBookings.map((booking) => (
                    <li key={booking.id} className="p-4 bg-white shadow rounded-md">
                      <strong>ID:</strong> {booking.id}<br />
                      <strong>{booking.fullname}</strong> - {booking.date} {booking.time}<br />
                      Email: {booking.email}<br />
                      Phone: {booking.phoneNumber}<br />
                      Note: {booking.bookingNote}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-100 rounded-md shadow-md mb-4">
            <button
              className="w-full text-left px-4 py-2 text-xl font-bold focus:outline-none"
              onClick={() => toggleSection('all')}
            >
              All Bookings
            </button>
            {openSection === 'all' && (
              <div className="px-4 py-2">
                <ul className="space-y-4">
                  {allBookings.map((booking) => (
                    <li key={booking.id} className="p-4 bg-white shadow rounded-md">
                      <strong>ID:</strong> {booking.id}<br />
                      <strong>{booking.fullname}</strong> - {booking.date} {booking.time}<br />
                      Email: {booking.email}<br />
                      Phone: {booking.phoneNumber}<br />
                      Note: {booking.bookingNote}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BayiDashboard;
