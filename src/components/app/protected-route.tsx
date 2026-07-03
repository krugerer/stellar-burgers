import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnauth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
