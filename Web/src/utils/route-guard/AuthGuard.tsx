import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
      return;
    }

    // Check if user has the Admin role
    const userRole = user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (userRole !== 'Admin') {
      // If user is not an Admin (whether they're Student or Sponsor), redirect to home
      navigate('/', {
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location, user]);

  // Only render children for Admin users
  if (!isLoggedIn || user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] !== 'Admin') {
    return null;
  }

  return children;
}
