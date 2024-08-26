import { describe, it, expect, vi, Mock } from 'vitest';
import { render } from '@testing-library/react';

import { useAuth } from '@/contexts/AuthContext';
import App from 'App';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const mockedUseAuth = useAuth as Mock;
    mockedUseAuth.mockReturnValue({
      isLoading: false,
      sessionToken: 'test-token',
    });

    const { getByText } = render(<App />);
    expect(getByText('Create a New Crawling Job')).toBeInTheDocument();
  });
});
