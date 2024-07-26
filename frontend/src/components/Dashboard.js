import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dealers, setDealers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }

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
    navigate('/');
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-16">
        <h3 className="text-2xl font-bold mb-4">Bayi Listesi</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">ID</th>
              <th className="py-2 px-4 border-b border-gray-200">Dealer Name</th>
              <th className="py-2 px-4 border-b border-gray-200">Email</th>
              <th className="py-2 px-4 border-b border-gray-200">Phone Number</th>
              <th className="py-2 px-4 border-b border-gray-200">Contact Name</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id}>
                <td className="py-2 px-4 border-b border-gray-200">{dealer.id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{dealer.dealerName}</td>
                <td className="py-2 px-4 border-b border-gray-200">{dealer.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{dealer.phoneNumber}</td>
                <td className="py-2 px-4 border-b border-gray-200">{dealer.contactName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
