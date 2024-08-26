import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/services/auth';

vi.mock('@/services/auth', () => ({ login: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    const mockedUseAuth = useAuth as Mock;
    mockedUseAuth.mockReturnValue({
      setSessionToken: vi.fn(),
    });
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  it('updates the input fields when typing', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('shows an error message when login fails', async () => {
    const mockedLogin = login as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedLogin.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument(),
    );
    expect(mockedSetSessionToken).not.toHaveBeenCalled();
  });

  it('calls setSessionToken when login succeeds', async () => {
    const mockedLogin = login as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedLogin.mockResolvedValue({ success: true, data: 'test-token' });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockedSetSessionToken).toHaveBeenCalledWith('test-token'),
    );
    expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
  });

  it('disables the submit button when loading', async () => {
    const mockedLogin = login as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ success: true, data: 'test-token' }),
            1000,
          );
        }),
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() =>
      expect(mockedSetSessionToken).toHaveBeenCalledWith('test-token'),
    );
    expect(submitButton).not.toBeDisabled();
  });

  it('shows error when email or password is missing', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /Login/i });

    // Submit with empty email and password
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/This field is required/i);
      expect(errorMessages.length).toBe(2);
    });
  });
});
