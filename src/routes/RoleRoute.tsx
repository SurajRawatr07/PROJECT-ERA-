import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  children,
  fallback
}) => {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFC]">
        <div className="w-8 h-8 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;

    // Redirect to user's permitted role dashboard
    if (role) {
      window.history.replaceState(null, '', `/dashboard/${role.toLowerCase()}`);
    }
    return null;
  }

  return <>{children}</>;
};
