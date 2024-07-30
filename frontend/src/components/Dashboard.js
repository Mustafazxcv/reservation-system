import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [editDealerData, setEditDealerData] = useState({
    dealerName: '',
    email: '',
    phoneNumber: '',
    contactName: '',
    status: true,
    timezone: ''
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dealers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setDealers(result);
        } else {
          console.error('Failed to fetch dealers');
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
      }
    };

    fetchDealers();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Başarıyla çıkış yapıldı!');
    setTimeout(() => navigate('/'), 2000); // 2 saniye sonra ana sayfaya yönlendir
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDealerData({
      ...editDealerData,
      [name]: value
    });
  };

  const handleEditDealer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/dealers/phone/${selectedDealer.phoneNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editDealerData)
      });

      if (response.ok) {
        const updatedDealer = await response.json();
        setDealers(dealers.map((dealer) => (dealer.phoneNumber === selectedDealer.phoneNumber ? updatedDealer : dealer)));
        setSelectedDealer(null);
        toast.success('Bayi bilgileri güncellendi!');
      } else {
        toast.error('Bayi bilgileri güncellenemedi.');
      }
    } catch (error) {
      toast.error('Bayi bilgileri güncellenemedi.');
      console.error('Error updating dealer:', error);
    }
  };

  const handleDeleteDealer = async (phoneNumber) => {
    try {
      const response = await fetch(`http://localhost:3000/api/dealers/phone/${phoneNumber}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDealers(dealers.filter((dealer) => dealer.phoneNumber !== phoneNumber));
        toast.success('Bayi silindi!');
      } else {
        toast.error('Bayi silinemedi.');
      }
    } catch (error) {
      toast.error('Bayi silinemedi.');
      console.error('Error deleting dealer:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-16">
        <h3 className="text-2xl font-bold mb-4">Bayi Listesi</h3>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Bayi Adı</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Telefon Numarası</th>
              <th className="py-3 px-4 text-left">İletişim Kişisi</th>
              <th className="py-3 px-4 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id} className="bg-white border-b last:border-none">
                <td className="py-3 px-4">{dealer.id}</td>
                <td className="py-3 px-4">{dealer.dealerName}</td>
                <td className="py-3 px-4">{dealer.email}</td>
                <td className="py-3 px-4">{dealer.phoneNumber}</td>
                <td className="py-3 px-4">{dealer.contactName}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedDealer(dealer)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteDealer(dealer.phoneNumber)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDealer && (
          <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Bayi Bilgilerini Güncelle</h3>
            <form onSubmit={handleEditDealer} className="space-y-4">
              <div>
                <label htmlFor="dealerName" className="block text-sm font-medium text-gray-700">Bayi Adı:</label>
                <input
                  type="text"
                  id="dealerName"
                  name="dealerName"
                  value={editDealerData.dealerName}
                  onChange={handleEditChange}
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
                  value={editDealerData.email}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefon Numarası:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editDealerData.phoneNumber}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">İletişim Kişisi:</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={editDealerData.contactName}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Durum:</label>
                <select
                  id="status"
                  name="status"
                  value={editDealerData.status}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={true}>Aktif</option>
                  <option value={false}>Pasif</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Saat Dilimi:</label>
                <input
                  type="text"
                  id="timezone"
                  name="timezone"
                  value={editDealerData.timezone}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Güncelle
              </button>
            </form>
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* ToastContainer component */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Dashboard;
