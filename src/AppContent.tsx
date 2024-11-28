import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useThesisStore } from './store/thesisStore';
import { useAuth } from './components/auth/AuthProvider';

// Loading spinner component for reusability
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Private Route component for protected routes
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingSpinner />;

  return user ? <>{children}</> : null;
}

export function AppContent() {
  const { user, loading } = useAuth();
  const { metadata } = useThesisStore(); // Note: metadata is unused, consider removing if not needed

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes with Redirects */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/thesis" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/thesis" replace /> : <Register />} 
      />
      
      {/* Protected Routes */}
      <Route
        path="/thesis"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      />
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}