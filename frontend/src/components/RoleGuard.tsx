import React, { useEffect } from 'react';
import { UserRole } from '../App';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  userRole: UserRole;
  fallback: () => void;
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, userRole, fallback, children }: RoleGuardProps) {
  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      fallback();
    }
  }, [userRole, allowedRoles, fallback]);

  if (!allowedRoles.includes(userRole)) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}
