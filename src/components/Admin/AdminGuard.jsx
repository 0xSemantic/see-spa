import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const isAuth = sessionStorage.getItem('admin_auth') === 'true';
  if (!isAuth) return <Navigate to="/admin" replace />;
  return children;
}
