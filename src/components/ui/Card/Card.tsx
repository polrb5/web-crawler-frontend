import { ReactNode } from 'react';

import styles from './Card.module.scss';

interface CardProps {
  heading: string;
  children: ReactNode;
}

const Card = ({ heading, children }: CardProps) => {
  return (
    <div className={styles['card']}>
      <h1 className={styles['card__heading']}>{heading}</h1>
      {children}
    </div>
  );
};

export default Card;
