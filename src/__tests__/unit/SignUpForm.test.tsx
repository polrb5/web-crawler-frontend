import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '@/components/forms/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { register } from '@/services/auth';

vi.mock('@/services/auth', () => ({ register: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SignUpForm Component', () => {
  beforeEach(() => {
    const mockedUseAuth = useAuth as Mock;
    mockedUseAuth.mockReturnValue({
      setSessionToken: vi.fn(),
    });
  });

  it('renders the sign-up form correctly', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Register/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  it('updates the input fields when typing', () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('shows an error message when registration fails', async () => {
    const mockedRegister = register as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedRegister.mockResolvedValue({
      success: false,
      message: 'Registration failed',
    });

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument(),
    );
    expect(mockedSetSessionToken).not.toHaveBeenCalled();
  });

  it('calls setSessionToken when registration succeeds', async () => {
    const mockedRegister = register as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedRegister.mockResolvedValue({ success: true, data: 'test-token' });

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockedSetSessionToken).toHaveBeenCalledWith('test-token'),
    );
    expect(screen.queryByText(/Registration failed/i)).not.toBeInTheDocument();
  });

  it('disables the submit button when loading', async () => {
    const mockedRegister = register as Mock;
    const mockedSetSessionToken = vi.fn();
    const mockedUseAuth = useAuth as Mock;

    mockedUseAuth.mockReturnValue({ setSessionToken: mockedSetSessionToken });
    mockedRegister.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ success: true, data: 'test-token' }),
            1000,
          );
        }),
    );

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

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
    render(<SignUpForm />);

    const submitButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/This field is required/i);
      expect(errorMessages.length).toBe(2);
    });
  });
});
