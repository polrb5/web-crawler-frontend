import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from 'react-router-dom';

import { useAuth } from './contexts';
import { Home, Login, SignUp } from 'pages';
import { AuthLayout, MainLayout } from '@/components/layout';

const MainRoutes = () => {
  const { sessionToken } = useAuth();

  return (
    <Router>
      <Routes>
        {sessionToken ? (
          <Route element={<MainLayout />}>
            <Route element={<Home />} path="/" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        ) : (
          <Route element={<AuthLayout />}>
            <Route element={<Login />} path="/login" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Navigate replace to="/login" />} path="*" />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default MainRoutes;
