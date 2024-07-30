import React from 'react';
import moment from 'moment-timezone';

const BookingList = ({ bookings, title, toggleSection, openSection }) => {
  return (
    <div className="bg-gray-100 rounded-md shadow-md mb-4">
      <button
        className="w-full text-left px-4 py-2 text-xl font-bold focus:outline-none"
        onClick={() => toggleSection(title)}
      >
        {title}
      </button>
      {openSection === title && (
        <div className="px-4 py-2">
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-4 bg-white shadow rounded-md">
                <strong>ID:</strong> {booking.id}<br />
                <strong>{booking.fullname}</strong> - {moment(booking.date).format('YYYY-MM-DD')} {moment(booking.time).format('HH:mm')}<br />
                Email: {booking.email}<br />
                Phone: {booking.phoneNumber}<br />
                Note: {booking.bookingNote}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingList;
