import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ThesisCreator</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/thesis"
                  className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  My Thesis
                </Link>
                <button
                  onClick={handleSignOut}
                  className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="ml-4 flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}