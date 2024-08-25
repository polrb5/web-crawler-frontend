import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth';

import styles from './Header.module.scss';
import { Button } from '@/components/ui';

const Header = () => {
  const { setSessionToken } = useAuth();

  const handleLogout = () => {
    logout();
    setSessionToken(null);
  };

  return (
    <header className={styles.header}>
      <div className={styles['header__content']}>
        <h1 className={styles['header__title']}>Web Crawler</h1>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
