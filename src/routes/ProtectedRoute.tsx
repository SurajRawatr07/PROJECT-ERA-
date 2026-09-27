import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onUnauthorized
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFC]">
        <div className="w-8 h-8 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return null;
  }

  return <>{children}</>;
};
