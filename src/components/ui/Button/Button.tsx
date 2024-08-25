import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[`button--${variant}`], {
        [styles['button--disabled']]: disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
