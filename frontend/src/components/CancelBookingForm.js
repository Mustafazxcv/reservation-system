import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CancelBookingForm = ({ token, fetchBookings }) => {
  const [cancelPhoneNumber, setCancelPhoneNumber] = useState('');

  const handleCancelPhoneNumberChange = (e) => {
    setCancelPhoneNumber(e.target.value);
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/cancel/cancel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumber: cancelPhoneNumber })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking canceled:', result);
        fetchBookings('upcoming');
        fetchBookings('canceled');
        setCancelPhoneNumber('');
        toast.success('Rezervasyon iptal edildi!');
      } else {
        toast.error('Rezervasyon iptal edilemedi.');
      }
    } catch (error) {
      toast.error('Rezervasyon iptal edilemedi.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Rezervasyon İptal Et</h2>
      <form onSubmit={handleCancelBooking} className="space-y-4">
        <div>
          <label htmlFor="cancelPhoneNumber" className="block text-sm font-medium text-gray-700">Telefon Numarası:</label>
          <input
            type="text"
            id="cancelPhoneNumber"
            name="cancelPhoneNumber"
            value={cancelPhoneNumber}
            onChange={handleCancelPhoneNumberChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">
          İptal Et
        </button>
      </form>
    </div>
  );
};

export default CancelBookingForm;
