import React from 'react';
import moment from 'moment-timezone';

const ReservationDetails = ({ reservation }) => {
  const { fullname, email, phoneNumber, bookingNote, date, timezone } = reservation;

  // Başlangıç ve bitiş zamanlarını oluşturma
  const startDateTime = moment(date).utc().format('YYYYMMDDTHHmmss[Z]');
  const endDateTime = moment(date).add(1, 'hours').utc().format('YYYYMMDDTHHmmss[Z]');

  // Google Takvim URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(fullname)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(bookingNote)}&location=&sf=true&output=xml`;

  // Yahoo Takvim URL
  const yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(fullname)}&st=${startDateTime}&et=${endDateTime}&desc=${encodeURIComponent(bookingNote)}&in_loc=`;

  // Office365 URL
  const office365CalendarUrl = `https://outlook.office.com/owa/?path=/calendar/action/compose&subject=${encodeURIComponent(fullname)}&startdt=${startDateTime}&enddt=${endDateTime}&body=${encodeURIComponent(bookingNote)}&location=`;

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Rezervasyon Detayları</h1>
      <p><strong>Ad Soyad:</strong> {fullname}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Telefon Numarası:</strong> {phoneNumber}</p>
      <p><strong>Not:</strong> {bookingNote}</p>
      <p><strong>Tarih:</strong> {moment(date).format('YYYY-MM-DD')}</p>
      <p><strong>Saat:</strong> {moment(date).format('HH:mm')}</p>
      <p><strong>Saat Dilimi:</strong> {timezone}</p>

      <h2 className="text-xl font-bold mt-6 mb-4">Takvime Ekle</h2>
      <div className="space-x-2">
        <button 
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" 
          onClick={() => window.open(googleCalendarUrl, '_blank')}
        >
          Google Takvim
        </button>
        <button 
          className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600" 
          onClick={() => window.open(yahooCalendarUrl, '_blank')}
        >
          Yahoo Takvim
        </button>
        <br></br>
        <br></br>
        <button 
          className="py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-900" 
          onClick={() => window.open(office365CalendarUrl, '_blank')}
        >
          Office365
        </button>
      </div>
    </div>
  );
};

export default ReservationDetails;
