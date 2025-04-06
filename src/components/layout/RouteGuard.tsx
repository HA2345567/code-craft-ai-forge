
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ requireAuth = true }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If auth is required and user is not logged in, redirect to auth page
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in and tries to access auth page, redirect to home
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
