import { FormEvent, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Card, ErrorMessage, InputField } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { ERROR_MESSAGES } from '@/constants/errors';
import { register } from '@/services/auth';

import styles from './SignUpForm.module.scss';

const SignUpForm = () => {
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
    } = await register(email, password);

    if (success && data) {
      setSessionToken(data);
    }
    if (!success && responseMessage) {
      setError(true);
      setMessage(responseMessage || ERROR_MESSAGES.FAILED_REGISTRATION);
    }

    setIsLoading(false);
  };

  return (
    <Card heading="Register">
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
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <div className={styles['form-wrapper__register-link']}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Card>
  );
};

export default SignUpForm;
