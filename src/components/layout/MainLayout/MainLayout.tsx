import { Outlet } from 'react-router-dom';

import Header from '@/components/layout/Header';

import styles from './MainLayout.module.scss';

const MainLayout = () => {
  return (
    <div className={styles['main-layout']}>
      <Header />
      <div className={styles['main-layout__content']}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
