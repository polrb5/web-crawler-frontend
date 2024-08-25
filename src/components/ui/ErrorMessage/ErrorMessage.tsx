import clsx from 'clsx';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  error: boolean;
  message: string | null;
  className?: string;
}

const ErrorMessage = ({ error, message, className }: ErrorMessageProps) => {
  if (!error || !message) return null;

  return <p className={clsx(styles.error, className)}>{message}</p>;
};

export default ErrorMessage;
