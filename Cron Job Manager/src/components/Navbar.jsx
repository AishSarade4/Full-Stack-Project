import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CronManager</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <Clock className="h-4 w-4" />
                  <span>Jobs</span>
                </Link>
                <Link
                  to="/webhooks"
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <Bell className="h-4 w-4" />
                  <span>Webhooks</span>
                </Link>
                {/* <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button> */}
              </>
            ) : (
              // <div className="flex items-center space-x-4">
              //   <Link
              //     to="/login"
              //     className="text-sm font-medium text-gray-700 hover:text-gray-900"
              //   >
              //     Login
              //   </Link>
              //   <Link
              //     to="/register"
              //     className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              //   >
              //     Register
              //   </Link>
              // </div>
              null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}