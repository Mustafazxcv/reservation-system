import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image6 from '../assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('admin_token');
  const dealerToken = localStorage.getItem('dealer_token');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('dealer_token');
    navigate('/');
  };

  return (
    <nav className="bg-white-800 text-gray p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={Image6} alt="Logo" className="h-10 w-10 object-contain" />
          <a href="/" className="text-3xl font-bold">Rezervasyon Sistemi</a>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
              Ana Sayfa
            </Link>
          </li>
          {adminToken && dealerToken ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bayiidashboard" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Bayi Dashboard
                </Link>
              </li>
            </>
          ) : adminToken ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login/dealer" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Bayi Giriş
                </Link>
              </li>
            </>
          ) : dealerToken ? (
            <>
              <li>
                <Link to="/bayiidashboard" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Bayi Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login/admin" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Admin Giriş
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login/admin" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Admin Giriş
                </Link>
              </li>
              <li>
                <Link to="/login/dealer" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Bayi Giriş
                </Link>
              </li>
              <li>
                <Link to="/register/dealer" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
                  Bayi Kayıt
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/rezervasyonsorgusu" className="hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
              Rezervasyon Sorgusu
            </Link>
          </li>
          {(adminToken || dealerToken) && (
            <li>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
