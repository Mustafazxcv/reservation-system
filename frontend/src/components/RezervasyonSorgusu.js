import React, { useState } from 'react';

const RezervasyonSorgusu = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/phone/${phoneNumber}`, {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.json();
        setBookings(result);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      setError('Error fetching bookings');
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Rezervasyon Sorgusu
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefon Numarası:</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sorgula
                </button>
              </div>
            </form>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            {bookings.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Rezervasyonlar</h3>
                <ul className="space-y-4">
                  {bookings.map((booking) => (
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
    </div>
  );
};

export default RezervasyonSorgusu;
