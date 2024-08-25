import { FormEvent, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, ErrorMessage, InputField } from '@/components/ui';
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

    const {
      success,
      data,
      message: responseMessage,
    } = await login(email, password);

    if (success && data) {
      setSessionToken(data);
    }
    if (!success && responseMessage) {
      setError(true);
      setMessage(responseMessage || 'Invalid credentials. Please try again.');
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
        <ErrorMessage error={error} message={message} />
        <Button type="submit" disabled={isLoading} variant="primary">
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className={styles['form-wrapper__register-link']}>
        Don't have an account? <Link to="/signup">Register here</Link>
      </div>
    </Card>
  );
};

export default LoginForm;
