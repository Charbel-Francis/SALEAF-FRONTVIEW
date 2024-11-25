import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import JWTContext from 'contexts/JWTContext';

export const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const context = useContext(JWTContext);
  const location = useLocation();

  if (!context?.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};