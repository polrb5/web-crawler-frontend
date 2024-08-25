import { Outlet } from 'react-router-dom';

import styles from './AuthLayout.module.scss';

const AuthLayout = () => (
  <div className={styles.container}>
    <div className={styles['auth-wrapper']}>
      <div className={styles.auth}>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
