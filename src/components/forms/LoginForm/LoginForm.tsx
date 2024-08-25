import { FormEvent, useState } from 'react';

import { Link } from 'react-router-dom';

import { Card, InputField } from '@/components/ui';
import { login } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const { setSessionToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (error) setError(false);
    if (!email || !password) return setError(true);

    setIsLoading(true);

    const { success, data, message } = await login(email, password);

    if (success && data) {
      setSessionToken(data);
    }
    if (!success && message) {
      setError(true);
      setMessage(message || 'Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Card heading="Login">
      <form className={styles['form-wrapper']} onSubmit={handleSubmit}>
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          showError={error && !email}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          showError={error && !password}
          placeholder="Enter your password"
        />
        {error && message && (
          <p className={styles['form-wrapper__form__error']}>{message}</p>
        )}
        <button
          type="submit"
          className={styles['form-wrapper__button']}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className={styles['form-wrapper__register-link']}>
        Don't have an account? <Link to="/signup">Register here</Link>
      </div>
    </Card>
  );
};

export default LoginForm;
