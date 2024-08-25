import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth';

const Home = () => {
  const { setSessionToken } = useAuth();

  const handleLogout = () => {
    logout();
    setSessionToken(null);
  };

  return (
    <>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      <h1>Backoffice Template</h1>;
    </>
  );
};

export default Home;
